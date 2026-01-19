"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  Trophy, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Plus,
  Play,
  Pause,
  Square,
  Dog,
  Target,
  Award,
  Heart,
  Share2,
  MessageCircle,
  Zap,
  Flame,
  Star,
  Dumbbell,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InitialQuiz from "@/components/InitialQuiz";

interface Run {
  id: string;
  date: string;
  distance: number;
  duration: number;
  pace: number;
  dogName: string;
}

interface Post {
  id: string;
  user: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
}

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  completed: boolean;
}

interface DailyWorkout {
  id: string;
  week: number;
  category: "A" | "B" | "C" | "D";
  title: string;
  description: string;
  duration: string;
  objective: string;
  details: string[];
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  completed: boolean;
}

export default function CanicrossApp() {
  const [showQuiz, setShowQuiz] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [runs, setRuns] = useState<Run[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRunTime, setCurrentRunTime] = useState(0);
  const [currentRunDistance, setCurrentRunDistance] = useState(0);
  const [userLevel, setUserLevel] = useState<"Iniciante" | "Intermediário" | "Avançado">("Iniciante");
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", title: "Corridas este mês", current: 0, target: 5, unit: "corridas", completed: false },
    { id: "2", title: "Distância total", current: 0, target: 10, unit: "km", completed: false },
    { id: "3", title: "Tempo de treino", current: 0, target: 60, unit: "min", completed: false }
  ]);

  const [dailyWorkouts, setDailyWorkouts] = useState<DailyWorkout[]>([
    // SEMANA 1 - Adaptação e Comandos
    {
      id: "1",
      week: 1,
      category: "A",
      title: "Caminhada + Comandos",
      description: "Ensinar comandos básicos e acostumar o cão a puxar",
      duration: "20 min",
      objective: "Ensinar comandos básicos e acostumar o cão a puxar",
      details: [
        "5 min caminhando",
        "Ensine: 'vamos' (partir), 'devagar', 'direita', 'esquerda', 'parar'",
        "10 min brincando de direcionar com comandos",
        "5 min caminhada leve"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "2",
      week: 1,
      category: "B",
      title: "Trote Leve",
      description: "Introdução ao trote com o cão à frente",
      duration: "15 min",
      objective: "Acostumar o cão a correr à frente sem puxar ainda",
      details: [
        "5 min caminhada",
        "5 min trotinho leve com o cão à frente (não precisa puxar ainda)",
        "5 min caminhada"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "3",
      week: 1,
      category: "C",
      title: "Trote Intervalado",
      description: "Alternância entre trote e caminhada",
      duration: "15 min",
      objective: "Construir resistência básica",
      details: [
        "1 min trotando + 1 min caminhando (repita 5x)"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    // SEMANA 2 - Introdução à Tração
    {
      id: "4",
      week: 2,
      category: "A",
      title: "Trote Intervalado Progressivo",
      description: "Aumentar tempo de trote",
      duration: "20 min",
      objective: "O cão começar a puxar com confiança",
      details: [
        "2 min trotando + 1 min caminhando (repita 6x)"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "5",
      week: 2,
      category: "B",
      title: "Tração Leve",
      description: "Primeiros exercícios de tração",
      duration: "20 min",
      objective: "Introduzir o conceito de puxar",
      details: [
        "5 min aquecimento caminhando",
        "5x de 30 segundos o cão puxando + 1 min de descanso",
        "5 min resfriamento"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "6",
      week: 2,
      category: "C",
      title: "Trote Contínuo Inicial",
      description: "Manter ritmo constante",
      duration: "18-20 min",
      objetivo: "Desenvolver resistência contínua",
      details: [
        "12 min de trote leve com o cão mantendo ritmo",
        "Caminhada final"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    // SEMANA 3 - Resistência e Ritmo
    {
      id: "7",
      week: 3,
      category: "A",
      title: "Trote Contínuo Estendido",
      description: "Aumentar duração do trote",
      duration: "25 min",
      objetivo: "Melhorar o fôlego do cão e o seu",
      details: [
        "15-18 min correndo",
        "7-10 min caminhada"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "8",
      week: 3,
      category: "B",
      title: "Intervalado Rápido",
      description: "Introduzir velocidade",
      duration: "20 min",
      objetivo: "Trabalhar explosão e velocidade",
      details: [
        "10 min trotando normal",
        "5 tiros de 20-30 segundos puxando mais forte",
        "5 min finais leves"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "9",
      week: 3,
      category: "C",
      title: "Trilha Leve",
      description: "Treino em terreno variado",
      duration: "25-30 min",
      objetivo: "Adaptação a diferentes terrenos",
      details: [
        "Caminhada + trote em terreno variado",
        "Foco em comandos de direção"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    // SEMANA 4 - Consolidando o Canicross
    {
      id: "10",
      week: 4,
      category: "A",
      title: "Corrida com Tração",
      description: "Corrida completa com o cão guiando",
      duration: "25-30 min",
      objetivo: "Aumentar segurança, ritmo e conexão",
      details: [
        "Ritmo leve, mantendo o cão sempre guiando"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "11",
      week: 4,
      category: "B",
      title: "Intervalado 2:1",
      description: "Treino intervalado avançado",
      duration: "30 min",
      objetivo: "Consolidar resistência e velocidade",
      details: [
        "2 min correndo + 1 min caminhando (10 ciclos)"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "12",
      week: 4,
      category: "C",
      title: "Simulação de Prova",
      description: "Treino longo simulando competição",
      duration: "30-35 min",
      objetivo: "Preparação final para próximo nível",
      details: [
        "Escolha trilha fácil",
        "Mantenha ritmo confortável",
        "Reforce comandos o tempo todo"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    // TREINOS INTERMEDIÁRIOS - SEMANAS 1 e 2
    {
      id: "13",
      week: 1,
      category: "A",
      title: "Endurance",
      description: "Corrida contínua em intensidade moderada",
      duration: "35-45 min",
      objetivo: "Aumentar a resistência do cão e sua capacidade aeróbica",
      details: [
        "10 min trote leve (aquecimento)",
        "20-25 min corrida contínua em intensidade moderada",
        "5-10 min caminhada e trote leve"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    {
      id: "14",
      week: 1,
      category: "B",
      title: "Intervalado de Força",
      description: "Tiros de força com tração intensa",
      duration: "25-30 min",
      objetivo: "Melhorar potência e tração",
      details: [
        "10 min aquecimento",
        "6 a 8 tiros de 45 segundos puxando forte",
        "Intervalo de 1 min caminhando entre os tiros",
        "5 min desaceleração"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    {
      id: "15",
      week: 1,
      category: "C",
      title: "Subidas",
      description: "Fortalecimento em terreno inclinado",
      duration: "30-40 min",
      objetivo: "Fortalecimento muscular e comando sob esforço",
      details: [
        "10 min aquecimento",
        "6 subidas curtas de 60-90 segundos cada",
        "Desça caminhando (recuperação)",
        "10 min trote leve final"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    // SEMANAS 3 e 4 - Velocidade, Técnica e Terreno
    {
      id: "16",
      week: 3,
      category: "A",
      title: "Fartlek na Trilha",
      description: "Ritmo variado conforme o terreno",
      duration: "35-45 min",
      objetivo: "Adaptação ao terreno e resposta rápida aos comandos",
      details: [
        "Ritmo variando entre leve, moderado e forte conforme o terreno",
        "Exemplo: 4 min leve → 2 min forte",
        "Exemplo: 5 min moderado → 1 min sprint"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    {
      id: "17",
      week: 3,
      category: "B",
      title: "Intervalado 2:1",
      description: "Velocidade controlada com intervalos",
      duration: "30-35 min",
      objetivo: "Ganho de velocidade controlada",
      details: [
        "2 min corrida rápida com tração",
        "1 min trote/caminhada",
        "Repetir por 10 ciclos"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    {
      id: "18",
      week: 3,
      category: "C",
      title: "Trilhas Técnicas",
      description: "Terreno desafiador com obstáculos",
      duration: "30-50 min",
      objetivo: "Melhorar coordenação e segurança",
      details: [
        "Terreno com curvas, raízes, subidas e descidas",
        "Trabalhar comandos: direita, esquerda, devagar, vamos, para"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    // SEMANAS 5 e 6 - Consolidação + Intensidade
    {
      id: "19",
      week: 5,
      category: "A",
      title: "Longão",
      description: "Corrida longa em ritmo moderado",
      duration: "45-60 min",
      objetivo: "Resistência avançada",
      details: [
        "Terreno fácil, ritmo moderado",
        "Foque em constância e hidratação"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    {
      id: "20",
      week: 5,
      category: "B",
      title: "Sprints com Tração",
      description: "Explosão e velocidade máxima",
      duration: "20-25 min",
      objetivo: "Explosão do cão + velocidade sua",
      details: [
        "8 a 10 tiros de 20-30 segundos puxando forte",
        "1 min de recuperação entre eles"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    {
      id: "21",
      week: 5,
      category: "C",
      title: "Simulação de Prova",
      description: "Preparação para competições",
      duration: "30-40 min",
      objetivo: "Preparar dupla para competições ou treinos intensos",
      details: [
        "Ritmo firme do início ao fim",
        "Trabalhar largada, ultrapassagens e comandos"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    // TREINOS AVANÇADOS - SEMANAS 1 e 2
    {
      id: "22",
      week: 1,
      category: "A",
      title: "Intervalado Forte",
      description: "Tiros de alta intensidade",
      duration: "30-40 min",
      objetivo: "Aumentar VO2 e potência do cão",
      details: [
        "10 min aquecimento",
        "8 a 10 tiros de 1 min em alta intensidade + 1 min de trote leve",
        "5 min desaceleração"
      ],
      difficulty: "Avançado",
      completed: false
    },
    {
      id: "23",
      week: 1,
      category: "B",
      title: "Subidas Longas",
      description: "Subidas prolongadas com tração",
      duration: "35-45 min",
      objetivo: "Força, potência e resistência muscular",
      details: [
        "10 min trotando",
        "4 a 6 subidas de 3 min com boa tração",
        "Recuperação descendo caminhando",
        "5 min finais leves"
      ],
      difficulty: "Avançado",
      completed: false
    },
    {
      id: "24",
      week: 1,
      category: "C",
      title: "Trilhas Técnicas Intensas",
      description: "Terreno técnico em alta velocidade",
      duration: "40-50 min",
      objetivo: "Controle e precisão em alta velocidade",
      details: [
        "Terreno com curvas, raízes, subidas curtas, descidas rápidas",
        "Trabalhar comandos rápidos: 'direita', 'esquerda', 'devagar', 'vamos'"
      ],
      difficulty: "Avançado",
      completed: false
    },
    {
      id: "25",
      week: 1,
      category: "D",
      title: "Resistência Contínua",
      description: "Corrida longa sem pausas",
      duration: "45-55 min",
      objetivo: "Base sólida para treinos explosivos",
      details: [
        "Ritmo firme, sem pausas",
        "Cão sempre à frente puxando"
      ],
      difficulty: "Avançado",
      completed: false
    },
    // SEMANAS 3 e 4 - Força Explosiva + Velocidade
    {
      id: "26",
      week: 3,
      category: "A",
      title: "Sprints com Tração",
      description: "Explosão máxima",
      duration: "25-35 min",
      objetivo: "Explosão e aceleração",
      details: [
        "10 min aquecimento",
        "10 a 12 sprints de 20-25 segundos puxando no máximo",
        "1 min caminhada leve entre eles"
      ],
      difficulty: "Avançado",
      completed: false
    },
    {
      id: "27",
      week: 3,
      category: "B",
      title: "Fartlek Avançado",
      description: "Variação intensa de ritmo",
      duration: "45 min",
      objetivo: "Adaptação metabólica e leitura de terreno",
      details: [
        "5 min ritmo moderado",
        "2 min forte",
        "3 min leve",
        "1 min sprint",
        "Repete 3-4 vezes"
      ],
      difficulty: "Avançado",
      completed: false
    },
    {
      id: "28",
      week: 3,
      category: "C",
      title: "Simulação de Prova com Ultrapassagens",
      description: "Treino competitivo",
      duration: "35-45 min",
      objetivo: "Preparo psicológico e técnico para competições",
      details: [
        "Corrido em trilha",
        "Pratique ultrapassar outros cães ou pessoas (mesmo que imaginárias)",
        "Trabalhe largada forte"
      ],
      difficulty: "Avançado",
      completed: false
    },
    {
      id: "29",
      week: 3,
      category: "D",
      title: "Subidas Explosivas",
      description: "Subidas curtas e intensas",
      duration: "30-35 min",
      objetivo: "Força máxima e potência",
      details: [
        "8 subidas curtas de 30-40 segundos",
        "Descida leve"
      ],
      difficulty: "Avançado",
      completed: false
    },
    // SEMANAS 5 e 6 - Pico de Performance + Prova
    {
      id: "30",
      week: 5,
      category: "A",
      title: "Tempo Run",
      description: "Ritmo forte e constante",
      duration: "30-40 min",
      objetivo: "Aumentar limiar anaeróbico",
      details: [
        "Correr em ritmo forte e constante",
        "Cão puxando de forma contínua"
      ],
      difficulty: "Avançado",
      completed: false
    },
    {
      id: "31",
      week: 5,
      category: "B",
      title: "Longão",
      description: "Corrida longa de resistência",
      duration: "60-75 min",
      objetivo: "Grande resistência física e mental",
      details: [
        "Terreno leve",
        "Ritmo confortável",
        "Hidratação e constância"
      ],
      difficulty: "Avançado",
      completed: false
    },
    {
      id: "32",
      week: 5,
      category: "C",
      title: "Intervalado 3:1",
      description: "Intervalos de alta intensidade",
      duration: "30-40 min",
      objetivo: "Velocidade sustentada",
      details: [
        "3 min forte + 1 min leve",
        "8-10 ciclos"
      ],
      difficulty: "Avançado",
      completed: false
    },
    {
      id: "33",
      week: 5,
      category: "D",
      title: "Treino Técnico Final",
      description: "Polimento técnico",
      duration: "25-35 min",
      objetivo: "Polir técnica antes de competições",
      details: [
        "Trilhas mais rápidas",
        "Comandos precisos",
        "Trabalhar descidas com controle"
      ],
      difficulty: "Avançado",
      completed: false
    }
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      user: "Maria Silva",
      avatar: "MS",
      content: "Primeira corrida de 5km com meu Border Collie! Que experiência incrível! 🐕💨",
      likes: 24,
      comments: 8,
      timestamp: "há 2 horas"
    },
    {
      id: "2",
      user: "João Santos",
      avatar: "JS",
      content: "Dica: sempre aqueça seu cão antes de corridas longas. Faz toda diferença!",
      likes: 45,
      comments: 12,
      timestamp: "há 5 horas"
    },
    {
      id: "3",
      user: "Ana Costa",
      avatar: "AC",
      content: "Conquistei minha meta mensal! 100km com meu parceiro de 4 patas 🏆",
      likes: 67,
      comments: 15,
      timestamp: "há 1 dia"
    }
  ]);

  // Check if quiz was completed before
  useEffect(() => {
    const quizStatus = localStorage.getItem("canicross_quiz_completed");
    if (quizStatus === "true") {
      setShowQuiz(false);
      setQuizCompleted(true);
    }
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const savedRuns = localStorage.getItem("canicross_runs");
    const savedGoals = localStorage.getItem("canicross_goals");
    const savedLevel = localStorage.getItem("canicross_level");
    const savedWorkouts = localStorage.getItem("canicross_workouts");
    
    if (savedRuns) setRuns(JSON.parse(savedRuns));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedLevel) setUserLevel(savedLevel as "Iniciante" | "Intermediário" | "Avançado");
    if (savedWorkouts) setDailyWorkouts(JSON.parse(savedWorkouts));
  }, []);

  // Save runs to localStorage
  useEffect(() => {
    if (runs.length > 0) {
      localStorage.setItem("canicross_runs", JSON.stringify(runs));
    }
  }, [runs]);

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem("canicross_goals", JSON.stringify(goals));
  }, [goals]);

  // Save level to localStorage
  useEffect(() => {
    localStorage.setItem("canicross_level", userLevel);
  }, [userLevel]);

  // Save workouts to localStorage
  useEffect(() => {
    localStorage.setItem("canicross_workouts", JSON.stringify(dailyWorkouts));
  }, [dailyWorkouts]);

  // Atualizar metas baseadas no nível
  useEffect(() => {
    const levelGoals = {
      "Iniciante": [
        { id: "1", title: "Corridas este mês", current: goals[0]?.current || 0, target: 5, unit: "corridas", completed: false },
        { id: "2", title: "Distância total", current: goals[1]?.current || 0, target: 10, unit: "km", completed: false },
        { id: "3", title: "Tempo de treino", current: goals[2]?.current || 0, target: 60, unit: "min", completed: false }
      ],
      "Intermediário": [
        { id: "1", title: "Corridas este mês", current: goals[0]?.current || 0, target: 12, unit: "corridas", completed: false },
        { id: "2", title: "Distância total", current: goals[1]?.current || 0, target: 50, unit: "km", completed: false },
        { id: "3", title: "Tempo de treino", current: goals[2]?.current || 0, target: 180, unit: "min", completed: false }
      ],
      "Avançado": [
        { id: "1", title: "Corridas este mês", current: goals[0]?.current || 0, target: 20, unit: "corridas", completed: false },
        { id: "2", title: "Distância total", current: goals[1]?.current || 0, target: 100, unit: "km", completed: false },
        { id: "3", title: "Tempo de treino", current: goals[2]?.current || 0, target: 300, unit: "min", completed: false }
      ]
    };

    const newGoals = levelGoals[userLevel].map(goal => ({
      ...goal,
      completed: goal.current >= goal.target
    }));

    setGoals(newGoals);
  }, [userLevel]);

  // Timer for running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setCurrentRunTime(prev => prev + 1);
        setCurrentRunDistance(prev => prev + 0.002); // Simula distância
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const handleQuizComplete = (level: "Iniciante" | "Intermediário" | "Avançado") => {
    setUserLevel(level);
    localStorage.setItem("canicross_level", level);
    localStorage.setItem("canicross_quiz_completed", "true");
    setShowQuiz(false);
    setQuizCompleted(true);
  };

  const startRun = () => {
    setIsRunning(true);
    setIsPaused(false);
    setCurrentRunTime(0);
    setCurrentRunDistance(0);
  };

  const pauseRun = () => {
    setIsPaused(!isPaused);
  };

  const stopRun = () => {
    if (currentRunTime > 0) {
      const newRun: Run = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        distance: parseFloat(currentRunDistance.toFixed(2)),
        duration: currentRunTime,
        pace: currentRunDistance > 0 ? currentRunTime / currentRunDistance / 60 : 0,
        dogName: "Seu Cão"
      };
      setRuns([newRun, ...runs]);
      
      // Update goals
      const updatedGoals = goals.map((goal, index) => {
        let newCurrent = goal.current;
        if (index === 0) newCurrent += 1;
        if (index === 1) newCurrent += newRun.distance;
        if (index === 2) newCurrent += Math.floor(newRun.duration / 60);
        
        return {
          ...goal,
          current: newCurrent,
          completed: newCurrent >= goal.target
        };
      });
      setGoals(updatedGoals);
    }
    setIsRunning(false);
    setIsPaused(false);
    setCurrentRunTime(0);
    setCurrentRunDistance(0);
  };

  const toggleWorkoutCompletion = (workoutId: string) => {
    setDailyWorkouts(dailyWorkouts.map(workout => 
      workout.id === workoutId 
        ? { ...workout, completed: !workout.completed }
        : workout
    ));
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDistance = runs.reduce((acc, run) => acc + run.distance, 0);
  const totalRuns = runs.length;
  const avgPace = runs.length > 0 
    ? runs.reduce((acc, run) => acc + run.pace, 0) / runs.length 
    : 0;

  // Verificar se o nível atual está completo (todos os treinos concluídos)
  const isCurrentLevelComplete = () => {
    const currentLevelWorkouts = dailyWorkouts.filter(w => w.difficulty === userLevel);
    return currentLevelWorkouts.every(w => w.completed);
  };

  // Verificar se um nível está desbloqueado
  const isLevelUnlocked = (level: "Iniciante" | "Intermediário" | "Avançado") => {
    if (level === "Iniciante") return true;
    if (level === "Intermediário") {
      const inicianteWorkouts = dailyWorkouts.filter(w => w.difficulty === "Iniciante");
      return inicianteWorkouts.every(w => w.completed);
    }
    if (level === "Avançado") {
      const intermediarioWorkouts = dailyWorkouts.filter(w => w.difficulty === "Intermediário");
      return intermediarioWorkouts.every(w => w.completed);
    }
    return false;
  };

  const filteredWorkouts = dailyWorkouts.filter(workout => workout.difficulty === userLevel);

  const getLevelColor = (level: string) => {
    switch(level) {
      case "Iniciante": return "bg-blue-500";
      case "Intermediário": return "bg-indigo-500";
      case "Avançado": return "bg-orange-500";
      default: return "bg-blue-500";
    }
  };

  const getLevelBorderColor = (level: string) => {
    switch(level) {
      case "Iniciante": return "border-blue-300";
      case "Intermediário": return "border-indigo-300";
      case "Avançado": return "border-orange-300";
      default: return "border-blue-300";
    }
  };

  const getLevelProgressColor = (level: string) => {
    switch(level) {
      case "Iniciante": return "bg-blue-500";
      case "Intermediário": return "bg-indigo-500";
      case "Avançado": return "bg-orange-500";
      default: return "bg-blue-500";
    }
  };

  // Show quiz if not completed
  if (showQuiz && !quizCompleted) {
    return <InitialQuiz onComplete={handleQuizComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dog className="w-8 h-8 sm:w-10 sm:h-10" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Stride</h1>
                <p className="text-xs sm:text-sm text-blue-100">Canicross para Iniciantes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getLevelColor(userLevel)} text-white font-bold px-3 py-1`}>
                {userLevel}
              </Badge>
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white">
                <AvatarFallback className="bg-blue-300 text-blue-900">VC</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md sticky top-[72px] sm:top-[80px] z-40">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-4 h-auto p-1 bg-gray-100">
              <TabsTrigger 
                value="dashboard" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white"
              >
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Início</span>
              </TabsTrigger>
              <TabsTrigger 
                value="track" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span>Correr</span>
              </TabsTrigger>
              <TabsTrigger 
                value="learn" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
                <span>Aprender</span>
              </TabsTrigger>
              <TabsTrigger 
                value="community" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-800" />
                <span className="hidden sm:inline">Comunidade</span>
                <span className="sm:hidden">Social</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="mt-0 py-6">
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Distância Total
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl sm:text-4xl font-bold">{totalDistance.toFixed(1)}</div>
                      <p className="text-blue-100 text-sm mt-1">quilômetros</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Total de Corridas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl sm:text-4xl font-bold">{totalRuns}</div>
                      <p className="text-cyan-100 text-sm mt-1">corridas registradas</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Ritmo Médio
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl sm:text-4xl font-bold">{avgPace.toFixed(1)}</div>
                      <p className="text-sky-100 text-sm mt-1">min/km</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Daily Workouts Section */}
                <Card className="shadow-lg border-2 border-blue-300 bg-gradient-to-br from-white to-blue-50">
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-blue-900">
                          <Dumbbell className="w-6 h-6 text-blue-600" />
                          Treinos Diários - Programa Completo
                        </CardTitle>
                        <CardDescription>Sistema de treino estruturado por semanas e categorias (A, B, C, D)</CardDescription>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant={userLevel === "Iniciante" ? "default" : "outline"}
                          onClick={() => setUserLevel("Iniciante")}
                          disabled={!isLevelUnlocked("Iniciante")}
                          className={`${userLevel === "Iniciante" ? "bg-blue-500 hover:bg-blue-600" : ""} ${!isLevelUnlocked("Iniciante") ? "opacity-50" : ""}`}
                        >
                          {!isLevelUnlocked("Iniciante") && <Lock className="w-3 h-3 mr-1" />}
                          Iniciante
                        </Button>
                        <Button
                          size="sm"
                          variant={userLevel === "Intermediário" ? "default" : "outline"}
                          onClick={() => isLevelUnlocked("Intermediário") && setUserLevel("Intermediário")}
                          disabled={!isLevelUnlocked("Intermediário")}
                          className={`${userLevel === "Intermediário" ? "bg-indigo-500 hover:bg-indigo-600" : ""} ${!isLevelUnlocked("Intermediário") ? "opacity-50" : ""}`}
                        >
                          {!isLevelUnlocked("Intermediário") && <Lock className="w-3 h-3 mr-1" />}
                          Intermediário
                        </Button>
                        <Button
                          size="sm"
                          variant={userLevel === "Avançado" ? "default" : "outline"}
                          onClick={() => isLevelUnlocked("Avançado") && setUserLevel("Avançado")}
                          disabled={!isLevelUnlocked("Avançado")}
                          className={`${userLevel === "Avançado" ? "bg-orange-500 hover:bg-orange-600" : ""} ${!isLevelUnlocked("Avançado") ? "opacity-50" : ""}`}
                        >
                          {!isLevelUnlocked("Avançado") && <Lock className="w-3 h-3 mr-1" />}
                          Avançado
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Alerta de progresso */}
                    {!isCurrentLevelComplete() && (
                      <div className="p-4 bg-blue-100 border-2 border-blue-300 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Target className="w-6 h-6 text-blue-600" />
                          <div>
                            <p className="font-bold text-blue-900 text-sm">Complete todos os treinos deste nível!</p>
                            <p className="text-xs text-blue-700">Os treinos do próximo nível serão liberados após concluir todas as metas da sua categoria atual.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isCurrentLevelComplete() && userLevel !== "Avançado" && (
                      <div className="p-4 bg-green-100 border-2 border-green-400 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Trophy className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-bold text-green-900 text-sm">🎉 Parabéns! Nível completo!</p>
                            <p className="text-xs text-green-700">Você desbloqueou o próximo nível. Clique no botão acima para avançar!</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Agrupamento por semana */}
                    {userLevel === "Iniciante" && [1, 2, 3, 4].map(weekNum => {
                      const weekWorkouts = filteredWorkouts.filter(w => w.week === weekNum);
                      if (weekWorkouts.length === 0) return null;

                      return (
                        <div key={weekNum} className="space-y-3">
                          <div className="flex items-center gap-3 mt-6 mb-3">
                            <div className="h-px bg-blue-300 flex-1"></div>
                            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              Semana {weekNum}
                              {weekNum === 1 && " - Adaptação e Comandos"}
                              {weekNum === 2 && " - Introdução à Tração"}
                              {weekNum === 3 && " - Resistência e Ritmo"}
                              {weekNum === 4 && " - Consolidando o Canicross"}
                            </h3>
                            <div className="h-px bg-blue-300 flex-1"></div>
                          </div>

                          {weekWorkouts.map((workout) => (
                            <div 
                              key={workout.id}
                              className={`p-5 rounded-xl border-2 ${getLevelBorderColor(workout.difficulty)} ${
                                workout.completed ? 'bg-green-50' : 'bg-white'
                              } hover:shadow-lg transition-all cursor-pointer`}
                              onClick={() => toggleWorkoutCompletion(workout.id)}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 ${getLevelColor(workout.difficulty)} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                                  {workout.completed ? (
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                  ) : (
                                    <span className="text-white font-bold text-lg">{workout.category}</span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-blue-600 text-white font-bold">
                                        Treino {workout.category}
                                      </Badge>
                                      <h3 className={`font-bold text-lg ${workout.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                        {workout.title}
                                      </h3>
                                    </div>
                                    <Badge className={`${getLevelColor(workout.difficulty)} text-white`}>
                                      {workout.duration}
                                    </Badge>
                                  </div>
                                  
                                  <p className={`text-sm font-semibold mb-2 ${workout.completed ? 'text-gray-400' : 'text-blue-700'}`}>
                                    🎯 Objetivo: {workout.objetivo}
                                  </p>
                                  
                                  <p className={`text-sm ${workout.completed ? 'text-gray-400' : 'text-gray-700'} mb-3`}>
                                    {workout.description}
                                  </p>

                                  <div className={`text-xs ${workout.completed ? 'text-gray-400' : 'text-gray-600'} space-y-1 mb-3 pl-4`}>
                                    {workout.details.map((detail, idx) => (
                                      <p key={idx}>• {detail}</p>
                                    ))}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={workout.completed ? 'border-green-500 text-green-700' : ''}>
                                      {workout.difficulty}
                                    </Badge>
                                    {workout.completed && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-2xl">🏅</span>
                                        <span className="text-xs text-green-600 font-semibold">Concluído</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}

                    {userLevel === "Intermediário" && [1, 3, 5].map(weekNum => {
                      const weekWorkouts = filteredWorkouts.filter(w => w.week === weekNum || (weekNum === 1 && w.week === 2) || (weekNum === 3 && w.week === 4) || (weekNum === 5 && w.week === 6));
                      if (weekWorkouts.length === 0) return null;

                      let weekTitle = "";
                      if (weekNum === 1) weekTitle = "Semanas 1 e 2 - Construção de Ritmo e Força";
                      if (weekNum === 3) weekTitle = "Semanas 3 e 4 - Velocidade, Técnica e Terreno";
                      if (weekNum === 5) weekTitle = "Semanas 5 e 6 - Consolidação + Intensidade";

                      return (
                        <div key={weekNum} className="space-y-3">
                          <div className="flex items-center gap-3 mt-6 mb-3">
                            <div className="h-px bg-indigo-300 flex-1"></div>
                            <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              {weekTitle}
                            </h3>
                            <div className="h-px bg-indigo-300 flex-1"></div>
                          </div>

                          {weekWorkouts.map((workout) => (
                            <div 
                              key={workout.id}
                              className={`p-5 rounded-xl border-2 ${getLevelBorderColor(workout.difficulty)} ${
                                workout.completed ? 'bg-green-50' : 'bg-white'
                              } hover:shadow-lg transition-all cursor-pointer`}
                              onClick={() => toggleWorkoutCompletion(workout.id)}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 ${getLevelColor(workout.difficulty)} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                                  {workout.completed ? (
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                  ) : (
                                    <span className="text-white font-bold text-lg">{workout.category}</span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-indigo-600 text-white font-bold">
                                        Treino {workout.category}
                                      </Badge>
                                      <h3 className={`font-bold text-lg ${workout.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                        {workout.title}
                                      </h3>
                                    </div>
                                    <Badge className={`${getLevelColor(workout.difficulty)} text-white`}>
                                      {workout.duration}
                                    </Badge>
                                  </div>
                                  
                                  <p className={`text-sm font-semibold mb-2 ${workout.completed ? 'text-gray-400' : 'text-indigo-700'}`}>
                                    🎯 Objetivo: {workout.objetivo}
                                  </p>
                                  
                                  <p className={`text-sm ${workout.completed ? 'text-gray-400' : 'text-gray-700'} mb-3`}>
                                    {workout.description}
                                  </p>

                                  <div className={`text-xs ${workout.completed ? 'text-gray-400' : 'text-gray-600'} space-y-1 mb-3 pl-4`}>
                                    {workout.details.map((detail, idx) => (
                                      <p key={idx}>• {detail}</p>
                                    ))}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={workout.completed ? 'border-green-500 text-green-700' : ''}>
                                      {workout.difficulty}
                                    </Badge>
                                    {workout.completed && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-2xl">🏅</span>
                                        <span className="text-xs text-green-600 font-semibold">Concluído</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}

                    {userLevel === "Avançado" && [1, 3, 5].map(weekNum => {
                      const weekWorkouts = filteredWorkouts.filter(w => w.week === weekNum || (weekNum === 1 && w.week === 2) || (weekNum === 3 && w.week === 4) || (weekNum === 5 && w.week === 6));
                      if (weekWorkouts.length === 0) return null;

                      let weekTitle = "";
                      if (weekNum === 1) weekTitle = "Semanas 1 e 2 - Intensidade e Técnica";
                      if (weekNum === 3) weekTitle = "Semanas 3 e 4 - Força Explosiva + Velocidade";
                      if (weekNum === 5) weekTitle = "Semanas 5 e 6 - Pico de Performance + Prova";

                      return (
                        <div key={weekNum} className="space-y-3">
                          <div className="flex items-center gap-3 mt-6 mb-3">
                            <div className="h-px bg-orange-300 flex-1"></div>
                            <h3 className="text-lg font-bold text-orange-900 flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              {weekTitle}
                            </h3>
                            <div className="h-px bg-orange-300 flex-1"></div>
                          </div>

                          {weekWorkouts.map((workout) => (
                            <div 
                              key={workout.id}
                              className={`p-5 rounded-xl border-2 ${getLevelBorderColor(workout.difficulty)} ${
                                workout.completed ? 'bg-green-50' : 'bg-white'
                              } hover:shadow-lg transition-all cursor-pointer`}
                              onClick={() => toggleWorkoutCompletion(workout.id)}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 ${getLevelColor(workout.difficulty)} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                                  {workout.completed ? (
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                  ) : (
                                    <span className="text-white font-bold text-lg">{workout.category}</span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-orange-600 text-white font-bold">
                                        Treino {workout.category}
                                      </Badge>
                                      <h3 className={`font-bold text-lg ${workout.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                        {workout.title}
                                      </h3>
                                    </div>
                                    <Badge className={`${getLevelColor(workout.difficulty)} text-white`}>
                                      {workout.duration}
                                    </Badge>
                                  </div>
                                  
                                  <p className={`text-sm font-semibold mb-2 ${workout.completed ? 'text-gray-400' : 'text-orange-700'}`}>
                                    🎯 Objetivo: {workout.objetivo}
                                  </p>
                                  
                                  <p className={`text-sm ${workout.completed ? 'text-gray-400' : 'text-gray-700'} mb-3`}>
                                    {workout.description}
                                  </p>

                                  <div className={`text-xs ${workout.completed ? 'text-gray-400' : 'text-gray-600'} space-y-1 mb-3 pl-4`}>
                                    {workout.details.map((detail, idx) => (
                                      <p key={idx}>• {detail}</p>
                                    ))}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={workout.completed ? 'border-green-500 text-green-700' : ''}>
                                      {workout.difficulty}
                                    </Badge>
                                    {workout.completed && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-2xl">🏅</span>
                                        <span className="text-xs text-green-600 font-semibold">Concluído</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}

                    {/* Mensagem final após completar todas as semanas */}
                    {isCurrentLevelComplete() && (
                      <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-xl mt-6">
                        <div className="flex items-center gap-4">
                          <Trophy className="w-12 h-12 text-green-600" />
                          <div>
                            <p className="font-bold text-green-900 text-lg">🎉 Parabéns! Programa {userLevel} Completo!</p>
                            <p className="text-sm text-green-700 mt-1">
                              Após o término de todos esses treinos com maestria, você estará apto a seguir no próximo nível!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {filteredWorkouts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Dumbbell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Nenhum treino disponível para este nível.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Goals Section */}
                <Card className="shadow-lg border-2 border-blue-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-blue-900">
                          <Target className="w-5 h-5 text-blue-600" />
                          Suas Metas
                        </CardTitle>
                        <CardDescription>Acompanhe seu progresso mensal - Nível {userLevel}</CardDescription>
                      </div>
                      <Badge className={`${getLevelColor(userLevel)} text-white font-bold`}>
                        {userLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {goals.map((goal) => (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm sm:text-base">{goal.title}</span>
                            {goal.completed && (
                              <span className="text-2xl">🏅</span>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">
                            {goal.current.toFixed(1)} / {goal.target} {goal.unit}
                          </span>
                        </div>
                        <div className="relative">
                          <Progress 
                            value={(goal.current / goal.target) * 100} 
                            className="h-3 bg-blue-100"
                          />
                          <div 
                            className={`absolute top-0 left-0 h-3 rounded-full ${getLevelProgressColor(userLevel)} transition-all`}
                            style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                          />
                        </div>
                        {goal.completed && (
                          <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Meta alcançada! Continue assim!
                          </p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Runs */}
                <Card className="shadow-lg border-2 border-cyan-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-cyan-900">
                      <TrendingUp className="w-5 h-5 text-cyan-600" />
                      Corridas Recentes
                    </CardTitle>
                    <CardDescription>Seu histórico de treinos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {runs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Nenhuma corrida registrada ainda.</p>
                        <p className="text-sm mt-1">Comece sua primeira corrida na aba "Correr"!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {runs.slice(0, 5).map((run) => (
                          <div 
                            key={run.id} 
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                                <Dog className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm sm:text-base">
                                  {run.distance.toFixed(2)} km
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {new Date(run.date).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{formatDuration(run.duration)}</p>
                              <p className="text-xs text-gray-600">{run.pace.toFixed(1)} min/km</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Track Tab */}
            <TabsContent value="track" className="mt-0 py-6">
              <div className="space-y-6">
                <Card className="shadow-xl border-2 border-blue-300 bg-gradient-to-br from-white to-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      Registrar Corrida
                    </CardTitle>
                    <CardDescription>Acompanhe sua corrida em tempo real</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Running Stats Display */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-200 text-center">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm text-gray-600 mb-1">Tempo</p>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                          {formatTime(currentRunTime)}
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-md border-2 border-cyan-200 text-center">
                        <MapPin className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                        <p className="text-sm text-gray-600 mb-1">Distância</p>
                        <p className="text-2xl sm:text-3xl font-bold text-cyan-900">
                          {currentRunDistance.toFixed(2)} km
                        </p>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {!isRunning ? (
                        <Button 
                          onClick={startRun}
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-6 text-lg shadow-lg"
                        >
                          <Play className="w-6 h-6 mr-2" />
                          Iniciar Corrida
                        </Button>
                      ) : (
                        <>
                          <Button 
                            onClick={pauseRun}
                            variant="outline"
                            className="flex-1 border-2 border-blue-500 text-blue-700 hover:bg-blue-50 py-6 text-lg font-semibold"
                          >
                            <Pause className="w-5 h-5 mr-2" />
                            {isPaused ? "Retomar" : "Pausar"}
                          </Button>
                          <Button 
                            onClick={stopRun}
                            variant="destructive"
                            className="flex-1 bg-red-500 hover:bg-red-600 py-6 text-lg font-semibold"
                          >
                            <Square className="w-5 h-5 mr-2" />
                            Finalizar
                          </Button>
                        </>
                      )}
                    </div>

                    {isRunning && (
                      <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg border-2 border-blue-300">
                        <p className="text-center text-sm font-medium text-blue-900">
                          {isPaused ? "⏸️ Corrida pausada" : "🏃 Corrida em andamento..."}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Tips */}
                <Card className="shadow-lg border-2 border-sky-200 bg-gradient-to-br from-white to-sky-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sky-900">
                      <Heart className="w-5 h-5 text-sky-600" />
                      Dicas Rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-sky-200">
                      <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sky-700 font-bold">1</span>
                      </div>
                      <p className="text-sm">Mantenha água disponível para você e seu cão</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-sky-200">
                      <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sky-700 font-bold">2</span>
                      </div>
                      <p className="text-sm">Comece com distâncias curtas e aumente gradualmente</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-sky-200">
                      <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sky-700 font-bold">3</span>
                      </div>
                      <p className="text-sm">Observe os sinais de cansaço do seu cão</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Learn Tab */}
            <TabsContent value="learn" className="mt-0 py-6">
              <div className="space-y-6">
                {/* Iniciante */}
                <Card className="shadow-lg border-2 border-blue-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-blue-900">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        Nível Iniciante
                      </CardTitle>
                      <Badge className="bg-blue-500 text-white">Básico</Badge>
                    </div>
                    <CardDescription>Fundamentos essenciais para começar no Canicross</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Dog className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 text-blue-900">Escolhendo o Equipamento Certo</h3>
                          <p className="text-sm text-gray-700 mb-3">
                            Aprenda sobre coleiras, cintos e linhas de tração adequadas para Canicross. 
                            O equipamento correto garante segurança e conforto para você e seu cão.
                          </p>
                          <Badge className="bg-blue-500 text-white">Essencial</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-cyan-50 to-sky-50 p-5 rounded-xl border-2 border-cyan-200 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 text-cyan-900">Primeiros Passos</h3>
                          <p className="text-sm text-gray-700 mb-3">
                            Como começar a treinar com seu cão, comandos básicos e adaptação gradual. 
                            Construa uma base sólida para evoluir com segurança.
                          </p>
                          <Badge className="bg-cyan-500 text-white">Fundamental</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Intermediário */}
                <Card className="shadow-lg border-2 border-indigo-300 bg-gradient-to-br from-white to-indigo-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-indigo-900">
                        <Zap className="w-6 h-6 text-indigo-600" />
                        Nível Intermediário
                      </CardTitle>
                      <Badge className="bg-indigo-500 text-white">Evolução</Badge>
                    </div>
                    <CardDescription>Aprimore suas técnicas e aumente seu desempenho</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border-2 border-indigo-200 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 text-indigo-900">Técnicas Avançadas de Corrida</h3>
                          <p className="text-sm text-gray-700 mb-3">
                            Aprenda técnicas de respiração, postura avançada e sincronização perfeita com seu cão. 
                            Melhore seu ritmo e eficiência nas corridas.
                          </p>
                          <Badge className="bg-indigo-500 text-white">Performance</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 text-purple-900">Planejamento de Treinos</h3>
                          <p className="text-sm text-gray-700 mb-3">
                            Crie planos de treino estruturados, estabeleça metas progressivas e aprenda a 
                            balancear intensidade com recuperação adequada.
                          </p>
                          <Badge className="bg-purple-500 text-white">Estratégia</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-5 rounded-xl border-2 border-teal-200 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 text-teal-900">Nutrição e Hidratação</h3>
                          <p className="text-sm text-gray-700 mb-3">
                            Entenda as necessidades nutricionais para atletas caninos, suplementação adequada 
                            e estratégias de hidratação para treinos intensos.
                          </p>
                          <Badge className="bg-teal-500 text-white">Saúde</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Avançado */}
                <Card className="shadow-xl border-4 border-amber-400 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
                        <Flame className="w-7 h-7 text-orange-500 animate-pulse" />
                        Nível Avançado
                      </CardTitle>
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold">Elite</Badge>
                    </div>
                    <CardDescription className="text-base font-semibold text-amber-900">
                      Para atletas que buscam excelência e competição
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 relative z-10">
                    <div className="bg-white p-5 rounded-xl border-3 border-amber-300 hover:shadow-2xl transition-all cursor-pointer hover:scale-105">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Award className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-2 text-amber-900">Preparação para Competições</h3>
                          <p className="text-sm text-gray-700 mb-3">
                            Estratégias de treino pré-competição, periodização avançada, análise de performance 
                            e técnicas mentais para alcançar o pódio.
                          </p>
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">Competitivo</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border-3 border-red-300 hover:shadow-2xl transition-all cursor-pointer hover:scale-105">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                          <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-2 text-red-900">Análise de Performance</h3>
                          <p className="text-sm text-gray-700 mb-3">
                            Use dados e métricas avançadas para otimizar treinos. Análise de ritmo, frequência cardíaca, 
                            VO2 máx e estratégias de recuperação científica.
                          </p>
                          <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white">Ciência</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border-3 border-orange-300 hover:shadow-2xl transition-all cursor-pointer hover:scale-105">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Star className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-2 text-orange-900">Treinamento de Elite</h3>
                          <p className="text-sm text-gray-700 mb-3">
                            Técnicas de atletas profissionais, treinos intervalados de alta intensidade (HIIT), 
                            periodização dupla e tripla, e preparação para ultramaratonas.
                          </p>
                          <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">Pro</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-5 rounded-xl border-2 border-amber-400 mt-4">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-amber-600" />
                        <div>
                          <p className="font-bold text-amber-900">Conquiste o Próximo Nível</p>
                          <p className="text-sm text-amber-800">Continue evoluindo e alcance a excelência no Canicross!</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Community Tab */}
            <TabsContent value="community" className="mt-0 py-6">
              <div className="space-y-6">
                <Card className="shadow-lg border-2 border-indigo-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-900">
                      <Users className="w-6 h-6 text-indigo-600" />
                      Comunidade PawRun
                    </CardTitle>
                    <CardDescription>Conecte-se com outros corredores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-6 shadow-lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Compartilhar Conquista
                    </Button>

                    <div className="space-y-4">
                      {posts.map((post) => (
                        <div 
                          key={post.id} 
                          className="bg-white p-5 rounded-xl border-2 border-gray-200 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            <Avatar className="w-12 h-12 border-2 border-indigo-200">
                              <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-bold">
                                {post.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-900">{post.user}</h4>
                                <span className="text-xs text-gray-500">{post.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-700 mb-4">{post.content}</p>
                              <div className="flex items-center gap-6">
                                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-pink-600 transition-colors">
                                  <Heart className="w-4 h-4" />
                                  <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{post.comments}</span>
                                </button>
                                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                                  <Share2 className="w-4 h-4" />
                                  <span>Compartilhar</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements - DESTAQUE MÁXIMO */}
                <Card className="shadow-2xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 relative overflow-hidden">
                  {/* Efeito de brilho animado */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600">
                        <div className="relative">
                          <Trophy className="w-10 h-10 text-yellow-500 drop-shadow-lg animate-bounce" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                        </div>
                        Suas Conquistas
                      </CardTitle>
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold px-4 py-2 shadow-lg">
                        🔥 Prime
                      </Badge>
                    </div>
                    <CardDescription className="text-base font-semibold text-amber-900 mt-2">
                      🏆 Badges e troféus desbloqueados - Motivo de orgulho!
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {/* Conquista 1 - Desbloqueada */}
                      <div className="flex flex-col items-center p-5 bg-white rounded-2xl border-4 border-yellow-400 shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer relative">
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl">✓</span>
                        </div>
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center mb-3 shadow-2xl animate-pulse">
                          <Award className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                        <p className="text-xs text-center font-bold text-gray-900">Primeira Corrida</p>
                        <p className="text-[10px] text-center text-yellow-700 font-semibold mt-1">🎖️ Desbloqueado!</p>
                      </div>

                      {/* Conquista 2 - Desbloqueada */}
                      <div className="flex flex-col items-center p-5 bg-white rounded-2xl border-4 border-blue-400 shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer relative">
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl">✓</span>
                        </div>
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500 rounded-full flex items-center justify-center mb-3 shadow-2xl animate-pulse">
                          <MapPin className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                        <p className="text-xs text-center font-bold text-gray-900">10km Total</p>
                        <p className="text-[10px] text-center text-blue-700 font-semibold mt-1">🎖️ Desbloqueado!</p>
                      </div>

                      {/* Conquista 3 - Desbloqueada */}
                      <div className="flex flex-col items-center p-5 bg-white rounded-2xl border-4 border-green-400 shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer relative">
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl">✓</span>
                        </div>
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-3 shadow-2xl animate-pulse">
                          <Activity className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                        <p className="text-xs text-center font-bold text-gray-900">5 Corridas</p>
                        <p className="text-[10px] text-center text-green-700 font-semibold mt-1">🎖️ Desbloqueado!</p>
                      </div>

                      {/* Conquista 4 - Bloqueada */}
                      <div className="flex flex-col items-center p-5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-4 border-gray-300 shadow-lg opacity-60 hover:opacity-80 transition-all duration-300 cursor-pointer relative">
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl">🔒</span>
                        </div>
                        <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center mb-3 shadow-lg">
                          <Trophy className="w-10 h-10 text-gray-600" />
                        </div>
                        <p className="text-xs text-center font-bold text-gray-700">50km Total</p>
                        <p className="text-[10px] text-center text-gray-600 font-semibold mt-1">🔒 Bloqueado</p>
                      </div>
                    </div>

                    {/* Barra de progresso geral */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 rounded-2xl border-2 border-yellow-400 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-900">Progresso Geral</span>
                        <span className="text-sm font-bold text-yellow-700">3/4 Conquistas</span>
                      </div>
                      <Progress value={75} className="h-4 bg-yellow-200" />
                      <p className="text-xs text-center text-gray-700 font-semibold mt-3">
                        🎯 Continue assim! Você está quase lá!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
