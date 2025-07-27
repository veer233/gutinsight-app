import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  ArrowRight, 
  Trophy, 
  Target, 
  Zap,
  Heart,
  Brain,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Questionnaire = ({ userResponses, setUserResponses, currentUser }) => {
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState(userResponses)
  const [showMilestone, setShowMilestone] = useState(false)

  // Questionnaire data structure
  const sections = [
    {
      id: 'symptoms',
      title: 'Digestive Symptoms',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      description: 'Tell us about your digestive health'
    },
    {
      id: 'diet',
      title: 'Dietary Patterns',
      icon: Target,
      color: 'from-orange-500 to-yellow-500',
      description: 'Share your eating habits and preferences'
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle Factors',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      description: 'How do you live and manage stress?'
    },
    {
      id: 'stool',
      title: 'Bowel Health',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      description: 'Important indicators of gut health'
    },
    {
      id: 'goals',
      title: 'Health Goals',
      icon: Trophy,
      color: 'from-emerald-500 to-teal-500',
      description: 'What do you want to achieve?'
    }
  ]

  const questions = {
    symptoms: [
      {
        id: 'bloating_frequency',
        type: 'scale',
        question: 'How often do you experience bloating?',
        description: 'Bloating can indicate digestive imbalances',
        scale: { min: 0, max: 10, labels: ['Never', 'Daily'] }
      },
      {
        id: 'digestive_discomfort',
        type: 'scale',
        question: 'Rate your overall digestive discomfort',
        description: 'Consider pain, cramping, and general unease',
        scale: { min: 0, max: 10, labels: ['No discomfort', 'Severe discomfort'] }
      },
      {
        id: 'energy_after_meals',
        type: 'scale',
        question: 'How is your energy level after eating?',
        description: 'Post-meal energy can indicate digestive efficiency',
        scale: { min: 0, max: 10, labels: ['Very tired', 'Very energized'] }
      },
      {
        id: 'food_sensitivities',
        type: 'multiple',
        question: 'Do you have any known food sensitivities?',
        description: 'Select all that apply',
        options: [
          'Dairy/Lactose',
          'Gluten',
          'Nuts',
          'Shellfish',
          'Eggs',
          'Soy',
          'FODMAPs',
          'Spicy foods',
          'None that I know of'
        ]
      }
    ],
    diet: [
      {
        id: 'diet_type',
        type: 'single',
        question: 'Which best describes your diet?',
        description: 'Your dietary pattern affects gut microbiome',
        options: [
          'Standard Western Diet',
          'Mediterranean',
          'Vegetarian',
          'Vegan',
          'Keto/Low-carb',
          'Paleo',
          'Intermittent Fasting',
          'Other'
        ]
      },
      {
        id: 'fiber_intake',
        type: 'scale',
        question: 'How much fiber do you consume daily?',
        description: 'Fiber feeds beneficial gut bacteria',
        scale: { min: 0, max: 10, labels: ['Very little', 'Very high'] }
      },
      {
        id: 'processed_foods',
        type: 'scale',
        question: 'How often do you eat processed foods?',
        description: 'Processed foods can disrupt gut health',
        scale: { min: 0, max: 10, labels: ['Never', 'Most meals'] }
      },
      {
        id: 'meal_timing',
        type: 'single',
        question: 'How regular are your meal times?',
        description: 'Consistent timing supports digestive rhythm',
        options: [
          'Very regular - same times daily',
          'Mostly regular with some variation',
          'Somewhat irregular',
          'Very irregular - eat when convenient'
        ]
      }
    ],
    lifestyle: [
      {
        id: 'stress_level',
        type: 'scale',
        question: 'What is your typical stress level?',
        description: 'Stress significantly impacts gut health',
        scale: { min: 0, max: 10, labels: ['Very relaxed', 'Very stressed'] }
      },
      {
        id: 'sleep_quality',
        type: 'scale',
        question: 'How would you rate your sleep quality?',
        description: 'Sleep affects gut microbiome balance',
        scale: { min: 0, max: 10, labels: ['Very poor', 'Excellent'] }
      },
      {
        id: 'exercise_frequency',
        type: 'single',
        question: 'How often do you exercise?',
        description: 'Physical activity promotes gut health',
        options: [
          'Daily',
          '4-6 times per week',
          '2-3 times per week',
          'Once per week',
          'Rarely or never'
        ]
      },
      {
        id: 'water_intake',
        type: 'scale',
        question: 'How much water do you drink daily?',
        description: 'Hydration is crucial for digestive health',
        scale: { min: 0, max: 10, labels: ['Very little', '8+ glasses'] }
      }
    ],
    stool: [
      {
        id: 'bowel_frequency',
        type: 'single',
        question: 'How often do you have bowel movements?',
        description: 'Frequency indicates digestive transit time',
        options: [
          'Multiple times per day',
          'Once per day',
          'Every other day',
          '2-3 times per week',
          'Less than twice per week'
        ]
      },
      {
        id: 'stool_consistency',
        type: 'single',
        question: 'What best describes your typical stool consistency?',
        description: 'Based on the Bristol Stool Chart',
        options: [
          'Type 1: Hard lumps (constipated)',
          'Type 2: Lumpy sausage (slightly constipated)',
          'Type 3: Sausage with cracks (normal)',
          'Type 4: Smooth sausage (ideal)',
          'Type 5: Soft blobs (lacking fiber)',
          'Type 6: Mushy consistency (mild diarrhea)',
          'Type 7: Liquid consistency (diarrhea)'
        ]
      },
      {
        id: 'bowel_urgency',
        type: 'scale',
        question: 'Do you experience urgency with bowel movements?',
        description: 'Urgency can indicate inflammation or sensitivity',
        scale: { min: 0, max: 10, labels: ['Never urgent', 'Always urgent'] }
      }
    ],
    goals: [
      {
        id: 'primary_goals',
        type: 'multiple',
        question: 'What are your primary health goals?',
        description: 'Select all that are important to you',
        options: [
          'Reduce bloating and gas',
          'Improve energy levels',
          'Better mood and mental clarity',
          'Weight management',
          'Reduce food sensitivities',
          'Improve immune function',
          'Better sleep quality',
          'Reduce inflammation',
          'Overall wellness optimization'
        ]
      },
      {
        id: 'supplement_experience',
        type: 'single',
        question: 'What is your experience with gut health supplements?',
        description: 'This helps us tailor recommendations',
        options: [
          'Never tried any',
          'Tried a few with mixed results',
          'Currently taking some',
          'Extensive experience',
          'Prefer natural approaches only'
        ]
      },
      {
        id: 'commitment_level',
        type: 'scale',
        question: 'How committed are you to making changes?',
        description: 'Honest assessment helps create realistic plans',
        scale: { min: 0, max: 10, labels: ['Not very committed', 'Extremely committed'] }
      },
      {
        id: 'additional_info',
        type: 'text',
        question: 'Any additional information about your gut health?',
        description: 'Share anything else that might be relevant (optional)',
        placeholder: 'Medical conditions, medications, specific concerns...'
      }
    ]
  }

  const currentSectionData = sections[currentSection]
  const currentQuestions = questions[currentSectionData.id]
  const currentQuestionData = currentQuestions[currentQuestion]
  const totalQuestions = Object.values(questions).flat().length
  const answeredQuestions = Object.keys(responses).length
  const progress = (answeredQuestions / totalQuestions) * 100

  useEffect(() => {
    if (!currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])

  useEffect(() => {
    // Check for milestones
    const milestones = [25, 50, 75, 100]
    const currentMilestone = milestones.find(m => 
      progress >= m && !responses[`milestone_${m}`]
    )
    
    if (currentMilestone) {
      setShowMilestone(currentMilestone)
      setResponses(prev => ({ ...prev, [`milestone_${currentMilestone}`]: true }))
    }
  }, [progress, responses])

  const handleAnswer = (value) => {
    const newResponses = { ...responses, [currentQuestionData.id]: value }
    setResponses(newResponses)
    setUserResponses(newResponses)
  }

  const nextQuestion = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
      setCurrentQuestion(0)
    } else {
      // Questionnaire complete
      navigate('/payment')
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      setCurrentQuestion(questions[sections[currentSection - 1].id].length - 1)
    }
  }

  const renderQuestion = () => {
    const question = currentQuestionData
    const currentAnswer = responses[question.id]

    switch (question.type) {
      case 'scale':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {currentAnswer || 0}
              </div>
              <div className="px-4">
                <Slider
                  value={[currentAnswer || 0]}
                  onValueChange={(value) => {
                    console.log('Slider value changed:', value[0]);
                    handleAnswer(value[0]);
                  }}
                  max={question.scale.max}
                  min={question.scale.min}
                  step={1}
                  className="w-full cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2 px-4">
                <span>{question.scale.labels[0]}</span>
                <span>{question.scale.labels[1]}</span>
              </div>
              {/* Alternative click buttons for easier interaction */}
              <div className="flex justify-center space-x-2 mt-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleAnswer(num)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      currentAnswer === num 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'single':
        return (
          <RadioGroup value={currentAnswer} onValueChange={handleAnswer}>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )

      case 'multiple':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${index}`}
                  checked={currentAnswer?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const current = currentAnswer || []
                    if (checked) {
                      handleAnswer([...current, option])
                    } else {
                      handleAnswer(current.filter(item => item !== option))
                    }
                  }}
                />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case 'text':
        return (
          <Textarea
            value={currentAnswer || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={question.placeholder}
            className="min-h-[120px]"
          />
        )

      default:
        return null
    }
  }

  const isAnswered = () => {
    const answer = responses[currentQuestionData.id]
    if (currentQuestionData.type === 'multiple') {
      return answer && answer.length > 0
    }
    if (currentQuestionData.type === 'text') {
      return true // Text questions are optional
    }
    return answer !== undefined && answer !== null
  }

  if (showMilestone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Milestone Reached!</h2>
              <p className="text-gray-600 mb-6">
                You're {showMilestone}% complete! Keep going to unlock your personalized gut health insights.
              </p>
              <Button 
                onClick={() => setShowMilestone(false)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500"
              >
                Continue Assessment
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Badge variant="secondary">
              Question {answeredQuestions + 1} of {totalQuestions}
            </Badge>
          </div>
          
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              {Math.round(progress)}% complete
            </p>
          </div>
        </div>

        {/* Section Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {sections.map((section, index) => {
              const Icon = section.icon
              const isActive = index === currentSection
              const isCompleted = index < currentSection
              
              return (
                <div
                  key={section.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : isCompleted 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium hidden sm:block">
                    {section.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSection}-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-r ${currentSectionData.color} rounded-lg flex items-center justify-center`}>
                    <currentSectionData.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Badge variant="outline">{currentSectionData.title}</Badge>
                  </div>
                </div>
                <CardTitle className="text-xl">
                  {currentQuestionData.question}
                </CardTitle>
                <CardDescription>
                  {currentQuestionData.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderQuestion()}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentSection === 0 && currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={nextQuestion}
            disabled={!isAnswered()}
            className="bg-gradient-to-r from-emerald-500 to-teal-500"
          >
            {currentSection === sections.length - 1 && currentQuestion === currentQuestions.length - 1 
              ? 'Complete Assessment' 
              : 'Next'
            }
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Questionnaire

