"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dog, User, Brain, Trophy, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";

interface Question {
  id: number;
  category: "dog" | "runner" | "awareness";
  question: string;
  options: {
    text: string;
    points: number;
  }[];
}

interface QuizProps {
  onComplete: (level: "Iniciante" | "Intermediário" | "Avançado") => void;
}

const questions: Question[] = [
  // BLOCO 1 - SOBRE O CACHORRO (5 perguntas)
  {
    id: 1,
    category: "dog",
    question: "Qual o porte do seu cachorro?",
    options: [
      { text: "Pequeno", points: 0 },
      { text: "Médio", points: 1 },
      { text: "Grande", points: 2 }
    ]
  },
  {
    id: 2,
    category: "dog",
    question: "Qual a idade do cachorro?",
    options: [
      { text: "Menos de 1 ano", points: 0 },
      { text: "1 a 3 anos", points: 2 },
      { text: "4 a 7 anos", points: 2 },
      { text: "Mais de 7 anos", points: 1 }
    ]
  },
  {
    id: 3,
    category: "dog",
    question: "Seu cachorro já foi avaliado por um veterinário para atividades físicas?",
    options: [
      { text: "Sim", points: 2 },
      { text: "Não", points: 0 }
    ]
  },
  {
    id: 4,
    category: "dog",
    question: "Seu cachorro costuma puxar a guia naturalmente?",
    options: [
      { text: "Sim, bastante", points: 2 },
      { text: "Às vezes", points: 1 },
      { text: "Não", points: 0 }
    ]
  },
  {
    id: 5,
    category: "dog",
    question: "Seu cachorro responde bem a comandos básicos (sentar, parar, vir)?",
    options: [
      { text: "Sim", points: 2 },
      { text: "Parcialmente", points: 1 },
      { text: "Não", points: 0 }
    ]
  },
  // BLOCO 2 - SOBRE VOCÊ (5 perguntas)
  {
    id: 6,
    category: "runner",
    question: "Você pratica corrida atualmente?",
    options: [
      { text: "Não", points: 0 },
      { text: "Sim, ocasionalmente", points: 1 },
      { text: "Sim, regularmente", points: 2 }
    ]
  },
  {
    id: 7,
    category: "runner",
    question: "Quantas vezes por semana você corre?",
    options: [
      { text: "Nunca", points: 0 },
      { text: "1–2x", points: 1 },
      { text: "3–4x", points: 2 },
      { text: "5x ou mais", points: 3 }
    ]
  },
  {
    id: 8,
    category: "runner",
    question: "Qual a distância média que você consegue correr hoje?",
    options: [
      { text: "Menos de 2 km", points: 0 },
      { text: "2–5 km", points: 1 },
      { text: "5–10 km", points: 2 },
      { text: "Mais de 10 km", points: 3 }
    ]
  },
  {
    id: 9,
    category: "runner",
    question: "Você já correu com o cachorro?",
    options: [
      { text: "Nunca", points: 0 },
      { text: "Algumas vezes", points: 1 },
      { text: "Frequentemente", points: 2 }
    ]
  },
  {
    id: 10,
    category: "runner",
    question: "Você já conhece ou praticou Canicross?",
    options: [
      { text: "Nunca ouvi falar", points: 0 },
      { text: "Já ouvi, mas nunca pratiquei", points: 1 },
      { text: "Já pratiquei", points: 2 }
    ]
  },
  // BLOCO 3 - PREPARO E CONSCIÊNCIA (5 perguntas)
  {
    id: 11,
    category: "awareness",
    question: "Você sabe identificar sinais de cansaço no cachorro?",
    options: [
      { text: "Sim", points: 2 },
      { text: "Um pouco", points: 1 },
      { text: "Não", points: 0 }
    ]
  },
  {
    id: 12,
    category: "awareness",
    question: "Você costuma treinar em horários adequados (manhã cedo ou fim da tarde)?",
    options: [
      { text: "Sempre", points: 2 },
      { text: "Às vezes", points: 1 },
      { text: "Nunca", points: 0 }
    ]
  },
  {
    id: 13,
    category: "awareness",
    question: "Você possui equipamentos adequados para Canicross?",
    options: [
      { text: "Nenhum", points: 0 },
      { text: "Alguns", points: 1 },
      { text: "Todos (peitoral, guia elástica, cinto)", points: 2 }
    ]
  },
  {
    id: 14,
    category: "awareness",
    question: "Qual seu principal objetivo com o app?",
    options: [
      { text: "Começar do zero", points: 0 },
      { text: "Evoluir com segurança", points: 1 },
      { text: "Melhorar performance", points: 2 }
    ]
  },
  {
    id: 15,
    category: "awareness",
    question: "Você se considera disciplinado para seguir um plano de treino?",
    options: [
      { text: "Sim", points: 2 },
      { text: "Mais ou menos", points: 1 },
      { text: "Não", points: 0 }
    ]
  }
];

export default function InitialQuiz({ onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showConversion, setShowConversion] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userLevel, setUserLevel] = useState<"Iniciante" | "Intermediário" | "Avançado">("Iniciante");

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentBlock = questions[currentQuestion].category;

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "dog":
        return {
          icon: Dog,
          title: "Sobre o Cachorro",
          color: "from-blue-500 to-cyan-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300"
        };
      case "runner":
        return {
          icon: User,
          title: "Sobre Você",
          color: "from-indigo-500 to-purple-600",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-300"
        };
      case "awareness":
        return {
          icon: Brain,
          title: "Preparo e Consciência",
          color: "from-orange-500 to-red-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-300"
        };
      default:
        return {
          icon: Dog,
          title: "",
          color: "from-blue-500 to-cyan-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300"
        };
    }
  };

  const handleAnswer = (points: number, optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    setTimeout(() => {
      const newAnswers = [...answers, points];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        calculateResult(newAnswers);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
      setSelectedOption(null);
    }
  };

  const calculateResult = (finalAnswers: number[]) => {
    const totalPoints = finalAnswers.reduce((acc, curr) => acc + curr, 0);
    setShowResult(true);
    
    let level: "Iniciante" | "Intermediário" | "Avançado";
    
    if (totalPoints <= 20) {
      level = "Iniciante";
    } else if (totalPoints <= 30) {
      level = "Intermediário";
    } else {
      level = "Avançado";
    }
    
    setUserLevel(level);
    
    setTimeout(() => {
      setShowResult(false);
      setShowConversion(true);
    }, 3000);
  };

  const getTotalPoints = () => answers.reduce((acc, curr) => acc + curr, 0);

  const getResultInfo = () => {
    const points = getTotalPoints();
    
    if (points <= 20) {
      return {
        level: "Iniciante",
        color: "from-blue-500 to-cyan-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-400",
        emoji: "🐾",
        title: "Bem-vindo ao Canicross!",
        description: "Você está começando sua jornada no mundo do Canicross. Não se preocupe, nosso plano foi desenvolvido especialmente para iniciantes como você!",
        message: "Vamos começar do básico, ensinando comandos, adaptando você e seu cachorro gradualmente, e construindo uma base sólida para evoluir com segurança."
      };
    } else if (points <= 30) {
      return {
        level: "Intermediário",
        color: "from-indigo-500 to-purple-600",
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-400",
        emoji: "🏃",
        title: "Você já tem experiência!",
        description: "Ótimo! Você já possui uma base sólida. Nosso plano intermediário vai te ajudar a aprimorar técnicas e aumentar seu desempenho.",
        message: "Vamos trabalhar resistência, velocidade, técnicas avançadas e preparar você para desafios maiores no Canicross."
      };
    } else {
      return {
        level: "Avançado",
        color: "from-orange-500 to-red-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-400",
        emoji: "🏆",
        title: "Atleta de Elite!",
        description: "Impressionante! Você é um atleta experiente. Nosso plano avançado foi criado para levar você e seu cachorro ao próximo nível.",
        message: "Treinos de alta intensidade, preparação para competições e técnicas de atletas profissionais te aguardam!"
      };
    }
  };

  const getLevelMessage = (level: "Iniciante" | "Intermediário" | "Avançado") => {
    switch(level) {
      case "Iniciante":
        return "Você está no ponto ideal para começar do jeito certo, sem sobrecarregar você ou seu cachorro.";
      case "Intermediário":
        return "Você já tem uma base sólida. Agora é hora de evoluir com método e consistência.";
      case "Avançado":
        return "Você e seu cachorro estão prontos para treinar com foco em performance e progressão.";
    }
  };

  // Tela de conversão final
  if (showConversion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          {/* Mensagem personalizada por nível */}
          <Card className="shadow-2xl border-4 border-blue-400 bg-gradient-to-br from-white to-blue-50 animate-in fade-in duration-700">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="mb-6">
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xl font-bold px-6 py-3 mb-4">
                  Nível: {userLevel}
                </Badge>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                {getLevelMessage(userLevel)}
              </p>
            </CardContent>
          </Card>

          {/* Prova social com IMAGENS REAIS fornecidas pelo usuário */}
          <Card className="shadow-2xl border-4 border-green-400 bg-gradient-to-br from-white to-green-50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-green-600" />
                Quem começou com o Stride viu a diferença
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-4 sm:px-6">
              {/* Card 1 - Transformação física clara */}
              <div className="bg-white p-6 rounded-xl border-2 border-green-300 shadow-lg">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/d22a0e58-d8f2-4746-bfde-9cd734002c4b.png" 
                    alt="Transformação: cachorro sedentário para ativo"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <p className="text-center text-base font-semibold text-gray-800 mt-4">
                  <span className="text-red-600">Antes:</span> pouca atividade e caminhadas sem foco
                  <br />
                  <span className="text-green-600">Depois:</span> treinos estruturados, saúde e disposição
                </p>
              </div>

              {/* Card 2 - Transformação de rotina */}
              <div className="bg-white p-6 rounded-xl border-2 border-green-300 shadow-lg">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/0795d621-4f38-4df3-b054-921fb5fba28d.png" 
                    alt="Transformação: rotina sedentária para ativa"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <p className="text-center text-base font-semibold text-gray-800 mt-4">
                  <span className="text-red-600">Antes:</span> rotina sedentária
                  <br />
                  <span className="text-green-600">Depois:</span> constância, bem-estar e parceria
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Texto de confiança */}
          <Card className="shadow-2xl border-4 border-indigo-400 bg-gradient-to-br from-white to-indigo-50">
            <CardContent className="p-8 sm:p-10">
              <p className="text-base sm:text-lg text-gray-800 text-center leading-relaxed">
                O Stride foi criado para quem quer treinar com consciência, respeitando o tempo do tutor e do cachorro. 
                Nada de treinos aleatórios ou promessas irreais. Aqui, o foco é <span className="font-bold text-indigo-700">segurança</span>, 
                <span className="font-bold text-indigo-700"> evolução</span> e <span className="font-bold text-indigo-700">parceria</span>.
              </p>
            </CardContent>
          </Card>

          {/* CTA para checkout */}
          <Card className="shadow-2xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="mb-6">
                <Trophy className="w-16 h-16 mx-auto text-yellow-600 animate-bounce" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Pronto para transformar sua jornada?
              </h3>
              <p className="text-base sm:text-lg text-gray-700 mb-8">
                Acesse agora o programa completo e comece a treinar com método, segurança e resultados reais.
              </p>
              <Button
                onClick={() => window.open("https://pay.cakto.com.br/whuto5r_724419", "_blank")}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg px-12 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Começar minha jornada no Canicross agora
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                🔒 Pagamento 100% seguro
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResult) {
    const result = getResultInfo();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 flex items-center justify-center p-4">
        <Card className={`w-full max-w-2xl shadow-2xl border-4 ${result.borderColor} ${result.bgColor} animate-in fade-in duration-700`}>
          <CardContent className="p-8 sm:p-12">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className={`w-32 h-32 mx-auto bg-gradient-to-br ${result.color} rounded-full flex items-center justify-center shadow-2xl animate-bounce`}>
                  <Trophy className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 text-6xl animate-pulse">
                  {result.emoji}
                </div>
              </div>

              <div className="space-y-3">
                <Badge className={`bg-gradient-to-r ${result.color} text-white text-xl font-bold px-6 py-2`}>
                  Nível: {result.level}
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {result.title}
                </h2>
                <p className="text-lg text-gray-700 font-semibold">
                  {result.description}
                </p>
              </div>

              <div className={`p-6 rounded-xl border-2 ${result.borderColor} bg-white`}>
                <p className="text-base text-gray-800">
                  {result.message}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Pontuação: {getTotalPoints()} pontos</span>
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse delay-100"></div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse delay-200"></div>
                </div>
                <p className="text-sm text-gray-600 font-semibold">
                  Preparando sua experiência personalizada...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(currentBlock);
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-3xl shadow-2xl border-4 ${categoryInfo.borderColor} ${categoryInfo.bgColor}`}>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${categoryInfo.color} rounded-lg flex items-center justify-center shadow-lg`}>
                <CategoryIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Quiz Inicial
                </CardTitle>
                <CardDescription className="text-base font-semibold">
                  {categoryInfo.title}
                </CardDescription>
              </div>
            </div>
            <Badge className={`bg-gradient-to-r ${categoryInfo.color} text-white font-bold px-4 py-2`}>
              {currentQuestion + 1}/{questions.length}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 font-medium">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              {questions[currentQuestion].question}
            </h3>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.points, index)}
                  className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-300 ${
                    selectedOption === index
                      ? `bg-gradient-to-r ${categoryInfo.color} text-white border-transparent scale-105 shadow-xl`
                      : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-lg hover:scale-102"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      selectedOption === index
                        ? "bg-white/20"
                        : "bg-gray-100"
                    }`}>
                      <span className={`font-bold ${
                        selectedOption === index ? "text-white" : "text-gray-600"
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <span className={`text-base sm:text-lg font-semibold ${
                      selectedOption === index ? "text-white" : "text-gray-800"
                    }`}>
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              variant="outline"
              className="border-2 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === Math.floor((currentQuestion / questions.length) * 3)
                      ? `bg-gradient-to-r ${categoryInfo.color}`
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
