'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { OpenTDBQuestion } from '../../../types/quiz';
import { FaArrowLeft } from 'react-icons/fa';

export default function QuizPlay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<OpenTDBQuestion[]>([]);

  // Get the question from URL or fetch a new quiz
  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }

    const fetchQuiz = async () => {
      setLoading(true);
      try {
        // Get question from URL or fetch a new one
        const questionParam = searchParams.get('question');
        
        if (questionParam) {
          // If we have a question in the URL, fetch related questions
          const category = searchParams.get('category') || '';
          const difficulty = searchParams.get('difficulty') || '';
          
          const baseUrl = "https://opentdb.com/api.php";
          const params = new URLSearchParams({
            amount: '5', // Get 5 questions for a short quiz
            type: 'multiple',
            ...(category && { category }),
            ...(difficulty && { difficulty })
          });

          const response = await fetch(`${baseUrl}?${params}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const data = await response.json();
          if (data.response_code !== 0) throw new Error(`API Error: ${data.response_code}`);
          
          // Make sure the question from URL is included
          const decodedQuestion = decodeURIComponent(questionParam);
          const hasUrlQuestion = data.results.some(q => q.question === decodedQuestion);
          
          if (!hasUrlQuestion && data.results.length > 0) {
            // Replace first question with the one from URL
            const urlQuestion = {
              category: searchParams.get('category') || 'General Knowledge',
              type: 'multiple',
              difficulty: searchParams.get('difficulty') || 'medium',
              question: decodedQuestion,
              correct_answer: searchParams.get('correct_answer') || '',
              incorrect_answers: (searchParams.get('incorrect_answers') || '').split(',')
            };
            
            data.results[0] = urlQuestion;
          }
          
          setQuestions(data.results);
        } else {
          // If no question in URL, fetch a random quiz
          const response = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const data = await response.json();
          if (data.response_code !== 0) throw new Error(`API Error: ${data.response_code}`);
          
          setQuestions(data.results);
        }
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [user, router, searchParams]);

  // Timer effect
  useEffect(() => {
    if (loading || showFeedback || quizComplete) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time's up, show feedback
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [loading, showFeedback, quizComplete, currentQuestionIndex]);

  // Reset timer when moving to next question
  useEffect(() => {
    if (!loading) setTimeLeft(30);
  }, [currentQuestionIndex, loading]);

  const currentQuestion = questions[currentQuestionIndex];
  
  // Prepare answer options (shuffle correct and incorrect)
  const getOptions = () => {
    if (!currentQuestion) return [];
    
    const options = [
      ...currentQuestion.incorrect_answers,
      currentQuestion.correct_answer
    ];
    
    // Fisher-Yates shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    return options;
  };
  
  const options = getOptions();

  const handleAnswer = (optionIndex: number | null) => {
    if (showFeedback || !currentQuestion) return;
    
    setSelectedOption(optionIndex);
    
    // Check if answer is correct
    const isAnswerCorrect = optionIndex !== null && 
      options[optionIndex] === currentQuestion.correct_answer;
    
    setIsCorrect(isAnswerCorrect);
    
    // Update score
    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
    }
    
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz complete
      setQuizComplete(true);
      
      // In a real app, you'd save the score to the backend here
      // updateUserXP(score * 20); // 20 XP per correct answer
    }
  };

  const handleExitQuiz = () => {
    router.push('/');
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101014] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-purple-300">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#101014] text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4 neon-text">Quiz Not Found</h1>
          <p className="text-gray-400 mb-6">Sorry, we couldn't load this quiz. Please try another one.</p>
          <button 
            onClick={handleExitQuiz}
            className="neon-btn"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101014] text-white flex flex-col">
      {/* Header with progress */}
      <header className="p-6 border-b border-gray-800">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <button 
              className="text-gray-400 hover:text-white" 
              onClick={() => setShowExitConfirm(true)}
            >
              <FaArrowLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold neon-text">{currentQuestion?.category}</h1>
              <p className="text-gray-400 text-sm">
                Question <span>{currentQuestionIndex + 1}</span> of <span>{questions.length}</span>
              </p>
            </div>
            <div className="w-5"></div> {/* Empty div for flex alignment */}
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-[#232336] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-purple-800"
              style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
            ></div>
          </div>
          
          {/* Timer bar */}
          <div className="h-2 bg-[#232336] rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>
      
      {/* Main quiz content */}
      <main className="flex-grow container mx-auto p-6">
        {!quizComplete ? (
          <>
            {/* Question section */}
            <div className="mb-8">
              <h2 
                className="text-2xl font-bold mb-8 text-center"
                dangerouslySetInnerHTML={{ __html: currentQuestion?.question || '' }}
              ></h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedOption === index 
                        ? 'bg-purple-700 border border-purple-500' 
                        : 'bg-[#232336] border border-[#3d3d5c] hover:bg-[#2c2c42]'
                    } ${
                      showFeedback && selectedOption === index && isCorrect
                        ? 'bg-green-600 border-green-500'
                        : showFeedback && selectedOption === index
                        ? 'bg-red-600 border-red-500'
                        : showFeedback && options[index] === currentQuestion?.correct_answer
                        ? 'bg-green-600 border-green-500'
                        : ''
                    }`}
                    onClick={() => !showFeedback && handleAnswer(index)}
                    disabled={showFeedback}
                  >
                    <span className="inline-block w-8 h-8 bg-[#232336] text-white rounded-full text-center leading-8 mr-3">
                      {['A', 'B', 'C', 'D'][index]}
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: option }}></span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Feedback section */}
            {showFeedback && (
              <div className="mb-8 text-center">
                <div className="p-6 rounded-xl bg-[#232336] inline-block">
                  <div className="text-4xl mb-2">{isCorrect ? '🎉' : '😕'}</div>
                  <h3 className="text-xl font-bold mb-2">{isCorrect ? 'Correct!' : 'Incorrect!'}</h3>
                  <p 
                    className="text-gray-300"
                    dangerouslySetInnerHTML={{ 
                      __html: `The correct answer is: ${currentQuestion?.correct_answer}` 
                    }}
                  ></p>
                </div>
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-center">
              {showFeedback && (
                <button 
                  className="neon-btn"
                  onClick={handleNextQuestion}
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              )}
            </div>
          </>
        ) : (
          /* Results section */
          <div className="flex items-center justify-center">
            <div className="bg-[#18181f] border border-purple-500/20 p-8 rounded-2xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6 text-center neon-text">Quiz Completed!</h2>
              
              <div className="flex justify-center mb-6">
                <div className="text-6xl">{score >= questions.length / 2 ? '🏆' : '🎯'}</div>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-3xl font-bold mb-2">{score}/{questions.length}</p>
                <p className="text-gray-400">
                  {score === questions.length 
                    ? 'Perfect score! Amazing job!' 
                    : score >= questions.length / 2 
                    ? 'Great job!' 
                    : 'Keep practicing!'}
                </p>
              </div>
              
              <div className="flex justify-center mb-8">
                <span className="flex items-center bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  +{score * 20} XP
                </span>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button 
                  className="neon-btn w-full"
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    setQuizComplete(false);
                    setShowFeedback(false);
                    setSelectedOption(null);
                  }}
                >
                  Play Again
                </button>
                <button 
                  className="bg-[#232336] text-white py-2 rounded-lg font-semibold hover:bg-[#2c2c42] transition w-full"
                  onClick={handleExitQuiz}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Confirm exit modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#18181f] border border-purple-500/20 p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Exit Quiz?</h2>
            <p className="text-gray-400 mb-6 text-center">Your progress will be lost. Are you sure?</p>
            
            <div className="flex space-x-3">
              <button 
                className="bg-[#232336] text-white py-2 rounded-lg font-semibold hover:bg-[#2c2c42] transition flex-1"
                onClick={() => setShowExitConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="neon-btn flex-1"
                onClick={handleExitQuiz}
              >
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}