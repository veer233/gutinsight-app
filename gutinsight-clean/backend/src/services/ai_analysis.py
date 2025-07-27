import openai
import json
import os
from typing import Dict, List, Any

class GutHealthAnalyzer:
    def __init__(self):
        # OpenAI API key is already set in environment
        self.client = openai.OpenAI()
        
    def analyze_responses(self, responses: Dict[str, Any], user_info: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Analyze user questionnaire responses and generate personalized gut health recommendations
        """
        try:
            # Prepare the analysis prompt
            prompt = self._create_analysis_prompt(responses, user_info)
            
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {
                        "role": "system",
                        "content": self._get_system_prompt()
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Parse the response
            analysis_text = response.choices[0].message.content
            
            # Extract structured data from the response
            structured_analysis = self._parse_analysis_response(analysis_text)
            
            return {
                "success": True,
                "analysis": analysis_text,
                "structured_data": structured_analysis,
                "recommendations": structured_analysis.get("recommendations", []),
                "priority_areas": structured_analysis.get("priority_areas", []),
                "gut_health_score": structured_analysis.get("gut_health_score", 0)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "analysis": "Unable to generate analysis at this time. Please try again later.",
                "recommendations": [],
                "priority_areas": [],
                "gut_health_score": 0
            }
    
    def _get_system_prompt(self) -> str:
        """
        System prompt that defines the AI's role and expertise
        """
        return """You are a certified nutritionist and gut health specialist with over 15 years of experience. 
        You specialize in analyzing digestive symptoms, dietary patterns, and lifestyle factors to provide 
        personalized gut health recommendations.

        Your analysis should be:
        - Evidence-based and scientifically sound
        - Personalized to the individual's specific responses
        - Practical and actionable
        - Encouraging and supportive in tone
        - Focused on natural and holistic approaches

        Always provide:
        1. A gut health score (1-100)
        2. 3-5 priority areas for improvement
        3. Specific dietary recommendations
        4. Lifestyle modifications
        5. Supplement suggestions (when appropriate)
        6. Timeline expectations for improvements

        Format your response as a comprehensive analysis followed by a JSON section with structured data.
        End your response with: 
        
        JSON_DATA_START
        {
          "gut_health_score": [score 1-100],
          "priority_areas": ["area1", "area2", "area3"],
          "recommendations": [
            {
              "category": "diet|lifestyle|supplements",
              "title": "recommendation title",
              "description": "detailed description",
              "priority": "high|medium|low"
            }
          ]
        }
        JSON_DATA_END"""
    
    def _create_analysis_prompt(self, responses: Dict[str, Any], user_info: Dict[str, Any] = None) -> str:
        """
        Create a detailed prompt based on user responses
        """
        prompt = "Please analyze the following gut health questionnaire responses and provide personalized recommendations:\n\n"
        
        # Add user info if available
        if user_info:
            prompt += f"User Information:\n"
            if user_info.get('full_name'):
                prompt += f"- Name: {user_info['full_name']}\n"
            prompt += "\n"
        
        # Process responses by category
        symptom_responses = {}
        diet_responses = {}
        lifestyle_responses = {}
        bowel_responses = {}
        goal_responses = {}
        
        for question_id, answer in responses.items():
            if 'bloating' in question_id or 'gas' in question_id or 'pain' in question_id:
                symptom_responses[question_id] = answer
            elif 'diet' in question_id or 'fiber' in question_id:
                diet_responses[question_id] = answer
            elif 'stress' in question_id or 'sleep' in question_id or 'exercise' in question_id:
                lifestyle_responses[question_id] = answer
            elif 'bowel' in question_id or 'stool' in question_id:
                bowel_responses[question_id] = answer
            elif 'goal' in question_id:
                goal_responses[question_id] = answer
        
        # Format responses by category
        if symptom_responses:
            prompt += "DIGESTIVE SYMPTOMS:\n"
            for q_id, answer in symptom_responses.items():
                prompt += f"- {self._format_question_response(q_id, answer)}\n"
            prompt += "\n"
        
        if diet_responses:
            prompt += "DIETARY PATTERNS:\n"
            for q_id, answer in diet_responses.items():
                prompt += f"- {self._format_question_response(q_id, answer)}\n"
            prompt += "\n"
        
        if lifestyle_responses:
            prompt += "LIFESTYLE FACTORS:\n"
            for q_id, answer in lifestyle_responses.items():
                prompt += f"- {self._format_question_response(q_id, answer)}\n"
            prompt += "\n"
        
        if bowel_responses:
            prompt += "BOWEL HEALTH:\n"
            for q_id, answer in bowel_responses.items():
                prompt += f"- {self._format_question_response(q_id, answer)}\n"
            prompt += "\n"
        
        if goal_responses:
            prompt += "HEALTH GOALS:\n"
            for q_id, answer in goal_responses.items():
                prompt += f"- {self._format_question_response(q_id, answer)}\n"
            prompt += "\n"
        
        prompt += """Please provide a comprehensive analysis including:
        1. Overall gut health assessment
        2. Key areas of concern
        3. Personalized dietary recommendations
        4. Lifestyle modifications
        5. Supplement suggestions (if appropriate)
        6. Expected timeline for improvements
        7. Warning signs to watch for
        
        Make the analysis encouraging and actionable, focusing on natural approaches to gut health improvement."""
        
        return prompt
    
    def _format_question_response(self, question_id: str, answer: Any) -> str:
        """
        Format question responses in a human-readable way
        """
        question_map = {
            'bloating_frequency': f"Bloating frequency: {self._scale_to_text(answer, 'frequency')}",
            'gas_frequency': f"Gas/flatulence frequency: {self._scale_to_text(answer, 'frequency')}",
            'stomach_pain': f"Stomach pain/cramping: {self._scale_to_text(answer, 'frequency')}",
            'diet_type': f"Diet type: {answer}",
            'fiber_intake': f"Fiber intake: {self._scale_to_text(answer, 'quality')}",
            'stress_level': f"Stress level: {self._scale_to_text(answer, 'intensity')}",
            'sleep_quality': f"Sleep quality: {self._scale_to_text(answer, 'quality')}",
            'exercise_frequency': f"Exercise frequency: {answer}",
            'bowel_movement_frequency': f"Bowel movement frequency: {answer}",
            'stool_consistency': f"Stool consistency: {answer}",
            'primary_goal': f"Primary health goal: {answer}"
        }
        
        return question_map.get(question_id, f"{question_id}: {answer}")
    
    def _scale_to_text(self, value: Any, scale_type: str) -> str:
        """
        Convert numeric scale values to descriptive text
        """
        # Handle non-numeric values
        if not isinstance(value, (int, float)):
            return str(value)
        
        try:
            value = int(value)
        except (ValueError, TypeError):
            return str(value)
        
        if scale_type == 'frequency':
            scale_map = {0: "Never", 1: "Rarely", 2: "Rarely", 3: "Sometimes", 4: "Sometimes", 
                        5: "Often", 6: "Often", 7: "Frequently", 8: "Frequently", 
                        9: "Very frequently", 10: "Daily"}
        elif scale_type == 'quality':
            scale_map = {0: "Very poor", 1: "Poor", 2: "Poor", 3: "Below average", 4: "Below average",
                        5: "Average", 6: "Average", 7: "Good", 8: "Good", 9: "Very good", 10: "Excellent"}
        elif scale_type == 'intensity':
            scale_map = {0: "Very low", 1: "Low", 2: "Low", 3: "Mild", 4: "Mild",
                        5: "Moderate", 6: "Moderate", 7: "High", 8: "High", 9: "Very high", 10: "Extreme"}
        else:
            return str(value)
        
        return scale_map.get(value, str(value))
    
    def _parse_analysis_response(self, analysis_text: str) -> Dict[str, Any]:
        """
        Extract structured data from the AI response
        """
        try:
            # Look for JSON data between markers
            start_marker = "JSON_DATA_START"
            end_marker = "JSON_DATA_END"
            
            start_idx = analysis_text.find(start_marker)
            end_idx = analysis_text.find(end_marker)
            
            if start_idx != -1 and end_idx != -1:
                json_str = analysis_text[start_idx + len(start_marker):end_idx].strip()
                return json.loads(json_str)
            else:
                # Fallback: try to extract basic information
                return {
                    "gut_health_score": 50,  # Default score
                    "priority_areas": ["Digestive Health", "Dietary Optimization", "Lifestyle Balance"],
                    "recommendations": [
                        {
                            "category": "diet",
                            "title": "Increase Fiber Intake",
                            "description": "Focus on whole foods and vegetables",
                            "priority": "high"
                        }
                    ]
                }
        except Exception as e:
            # Return default structure if parsing fails
            return {
                "gut_health_score": 50,
                "priority_areas": ["Digestive Health", "Dietary Optimization"],
                "recommendations": []
            }
    
    def get_product_recommendations(self, analysis_data: Dict[str, Any], available_products: List[Dict]) -> List[Dict]:
        """
        Match analysis results with appropriate products
        """
        recommendations = []
        priority_areas = analysis_data.get("priority_areas", [])
        gut_health_score = analysis_data.get("gut_health_score", 50)
        
        # Basic product matching logic
        for product in available_products:
            category = product.get("category", "").lower()
            
            # Match products based on priority areas and gut health score
            if gut_health_score < 60:
                if category in ["probiotics", "enzymes", "fiber"]:
                    recommendations.append({
                        **product,
                        "match_reason": "Recommended for improving overall gut health",
                        "priority": "high"
                    })
            
            if "digestive" in " ".join(priority_areas).lower():
                if category in ["probiotics", "enzymes"]:
                    recommendations.append({
                        **product,
                        "match_reason": "Supports digestive function",
                        "priority": "medium"
                    })
            
            if "stress" in " ".join(priority_areas).lower():
                if category in ["supplements", "herbal"]:
                    recommendations.append({
                        **product,
                        "match_reason": "May help with stress-related digestive issues",
                        "priority": "medium"
                    })
        
        # Remove duplicates and limit to top 6 recommendations
        seen_ids = set()
        unique_recommendations = []
        for rec in recommendations:
            if rec["id"] not in seen_ids:
                seen_ids.add(rec["id"])
                unique_recommendations.append(rec)
        
        return unique_recommendations[:6]

