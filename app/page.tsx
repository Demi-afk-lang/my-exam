"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EXAM_TIME = 60; 

const fastQuestions = [
  { id: 1, text: "ما هي عاصمة جمهورية مصر العربية؟", options: ["الإسكندرية", "القاهرة", "طنطا", "الجيزة"], correct: "B" },
  { id: 2, text: "محافظة الغربية مشهورة بمدينة الصناعة وهي؟", options: ["المحلة الكبرى", "كفر الشيخ", "المنصورة", "دمنهور"], correct: "A" },
  { id: 3, text: "أكبر كوكب في المجموعة الشمسية هو؟", options: ["الأرض", "المريخ", "المشترى", "زحل"], correct: "C" },
  { id: 4, text: "ما هو لون العلم المصري (أعلى لون)? ", options: ["أسود", "أبيض", "أخضر", "أحمر"], correct: "D" },
  { id: 5, text: "من هو ملك الغابة؟", options: ["الفيل", "الأسد", "النمر", "الزرافة"], correct: "B" },
];

export default function ExamPage() {
  const [stage, setStage] = useState<'landing' | 'quiz' | 'result' | 'goodbye'>('landing');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME);

  const playSound = (src: string) => { 
    if (typeof window !== 'undefined') {
      new Audio(src).play().catch(() => {}); 
    }
  };

  const score = fastQuestions.reduce((acc, q) => (answers[q.id] === q.correct ? acc + 1 : acc), 0);
  const percentage = (score / fastQuestions.length) * 100;

  const getFeedback = () => {
    if (percentage === 100) return "عبقري.. أنت أكيد بتغش من المحافظ! 🧠✨";
    if (percentage >= 80) return "ممتاز جداً.. فاضلك تكة وتبقى وزير! 🚀";
    if (percentage >= 50) return "شغال.. بس محتاج تشد حيلك شوية يا بطل. 📚";
    if (percentage > 0) return "يا أخي حرام عليك.. الكتاب زعل منك! 💀";
    return "صفر؟ أنت كنت فاتح الامتحان تتفرج على الدوائر? 🤡";
  };

  useEffect(() => {
    if (stage === 'result') {
      playSound(`/exam sound/${percentage}% grade.mp3`);
    }
  }, [stage, percentage]);

  useEffect(() => {
    let timer: any;
    if (stage === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && stage === 'quiz') {
      setStage('result');
    }
    return () => clearInterval(timer);
  }, [stage, timeLeft]);

  const handleSelect = (qId: number, optionLetter: string) => {
    if (answers[qId] || stage !== 'quiz') return;
    const currentQ = fastQuestions.find(q => q.id === qId);
    if (optionLetter === currentQ?.correct) {
      playSound('/exam sound/right answer.mp3');
    } else {
      playSound('/exam sound/wrong answer.mp3');
    }
    setAnswers(prev => ({ ...prev, [qId]: optionLetter }));
  };

  return (
    <main className="min-h-screen bg-[#020617] font-sans relative overflow-hidden flex items-center justify-center text-white" dir="rtl">
      <AnimatePresence mode="wait">
        {stage === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="z-20 text-center p-6">
              
              {/* اللوجو بتصميم كاتشي وكريتيف */}
              <div className="relative inline-block mb-2 group">
                <h1 className="text-7xl font-[1000] tracking-tighter flex items-center justify-center italic">
                  <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-transform group-hover:-skew-x-12 duration-300">LO</span>
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 px-1 transition-transform group-hover:skew-x-12 duration-300">
                    CUS
                    <span className="absolute -bottom-1 left-0 w-full h-[6px] bg-blue-600 rounded-full blur-[2px] opacity-50 group-hover:opacity-100 transition-opacity"></span>
                  </span>
                </h1>
              </div>

              <p className="text-blue-500 text-sm mb-12 font-black uppercase tracking-[0.6em] block opacity-90">
                Locus Digital
              </p>

              <button onClick={() => setStage('quiz')} className="bg-white text-black px-16 py-5 rounded-full text-2xl font-black shadow-2xl hover:bg-yellow-400 transition-colors">دخول الامتحان</button>
          </motion.div>
        )}

        {stage === 'quiz' && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-3xl p-6 relative">
            <div className="fixed top-6 left-6 z-30 flex items-center gap-3 bg-[#0f172a]/90 backdrop-blur-md p-4 rounded-3xl border border-slate-700 shadow-2xl">
                <div className="relative w-14 h-7 border-2 border-slate-500 rounded-md p-[2px] after:content-[''] after:absolute after:-right-[6px] after:top-1/2 after:-translate-y-1/2 after:w-[4px] after:h-3 after:bg-slate-500 after:rounded-r-sm">
                    <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ 
                      width: `${(timeLeft / EXAM_TIME) * 100}%`,
                      backgroundColor: timeLeft <= 15 ? "#ef4444" : timeLeft <= 30 ? "#eab308" : "#22c55e" 
                    }}
                    className="h-full rounded-sm"
                  />
                </div>
                <span className={`font-mono font-bold text-lg ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-white"}`}>{timeLeft}s</span>
            </div>

            <div className="space-y-6 mt-16">
              {fastQuestions.map((q) => (
                <div key={q.id} className="bg-[#0f172a] p-8 rounded-[35px] border border-slate-800 shadow-2xl">
                  <h3 className="text-xl font-bold mb-6">{q.text}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((option, idx) => {
                      const letter = ['A', 'B', 'C', 'D'][idx];
                      const isCorrect = letter === q.correct;
                      const isSelected = answers[q.id] === letter;
                      let style = "border-slate-800 text-slate-400 hover:bg-slate-800";
                      if (!!answers[q.id]) {
                        if (isCorrect) style = "bg-emerald-600 border-emerald-400 text-white";
                        else if (isSelected) style = "bg-red-600 border-red-400 text-white";
                      }
                      return (
                        <button key={option} onClick={() => handleSelect(q.id, letter)} className={`p-4 rounded-2xl border-2 transition-all text-right font-bold flex items-center ${style}`}>
                          <span className="w-8 h-8 flex items-center justify-center rounded-full ml-3 bg-black/20 text-yellow-500">{letter}</span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {Object.keys(answers).length === fastQuestions.length && (
              <button onClick={() => setStage('result')} className="w-full mt-10 bg-yellow-500 text-black py-5 rounded-3xl font-black text-2xl shadow-2xl">عرض النتيجة</button>
            )}
          </motion.div>
        )}

        {stage === 'result' && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="z-50 text-center p-8 bg-[#0f172a] border border-slate-800 rounded-[50px] shadow-3xl max-w-md w-full mx-4">
              <h2 className="text-slate-500 text-sm font-bold mb-4 uppercase tracking-widest">درجتك النهائية هي</h2>
              <div className="text-8xl font-black mb-4 text-white">{percentage}%</div>
              <p className="text-2xl font-bold mb-8 text-yellow-400 px-4 leading-relaxed">{getFeedback()}</p>
              <div className="h-2 w-full bg-slate-800 rounded-full mb-10 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1 }} className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              </div>
              <button onClick={() => setStage('goodbye')} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-300 font-bold transition-colors">إغلاق الامتحان</button>
          </motion.div>
        )}

        {stage === 'goodbye' && (
          <motion.div key="goodbye" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center p-10">
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-8xl mb-8 inline-block origin-bottom">👋</motion.div>
              <h1 className="text-5xl font-black text-white mb-4">إلى اللقاء!</h1>
              <p className="text-slate-400 text-xl font-medium mb-2">تم تسجيل خروجك بأمان</p>
              <p className="text-blue-500 font-bold tracking-widest italic uppercase">See you in the next challenge</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}