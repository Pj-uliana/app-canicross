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
  Lock,
  Calendar,
  Coffee,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  day: number;
  category: "A" | "B" | "C" | "D" | "REST";
  title: string;
  description: string;
  duration: string;
  objective: string;
  details: string[];
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  completed: boolean;
  // Para nível intermediário: rastrear conclusão em cada semana
  completedWeek1?: boolean;
  completedWeek2?: boolean;
}

interface WeekProgress {
  weekNumber: number;
  unlocked: boolean;
  completedWorkouts: number;
  totalWorkouts: number;
}

interface WeeklySummary {
  weekNumber: number;
  completedWorkouts: number;
  totalTime: number;
  workoutTypes: string[];
  isRepeat?: boolean; // Para nível intermediário
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

  // Estados para controle de semanas
  const [weekProgress, setWeekProgress] = useState<WeekProgress[]>([]);
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  const [currentWeeklySummary, setCurrentWeeklySummary] = useState<WeeklySummary | null>(null);
  const [showBlockedMessage, setShowBlockedMessage] = useState(false);
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>(["Iniciante"]);

  const [dailyWorkouts, setDailyWorkouts] = useState<DailyWorkout[]>([
    // SEMANA 1 - Adaptação e Comandos (Iniciante)
    {
      id: "1-1",
      week: 1,
      day: 1,
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
      id: "1-2",
      week: 1,
      day: 2,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objective: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "1-3",
      week: 1,
      day: 3,
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
      id: "1-4",
      week: 1,
      day: 4,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objective: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "1-5",
      week: 1,
      day: 5,
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
    {
      id: "1-6",
      week: 1,
      day: 6,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objetivo: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    // SEMANA 2 - Introdução à Tração (Iniciante)
    {
      id: "2-1",
      week: 2,
      day: 1,
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
      id: "2-2",
      week: 2,
      day: 2,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objetivo: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "2-3",
      week: 2,
      day: 3,
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
      id: "2-4",
      week: 2,
      day: 4,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objetivo: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "2-5",
      week: 2,
      day: 5,
      category: "C",
      title: "Trote Contínuo Inicial",
      description: "Manter ritmo constante",
      duration: "18-20 min",
      objective: "Desenvolver resistência contínua",
      details: [
        "12 min de trote leve com o cão mantendo ritmo",
        "Caminhada final"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "2-6",
      week: 2,
      day: 6,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objetivo: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    // SEMANA 3 - Resistência e Ritmo (Iniciante)
    {
      id: "3-1",
      week: 3,
      day: 1,
      category: "A",
      title: "Trote Contínuo Estendido",
      description: "Aumentar duração do trote",
      duration: "25 min",
      objective: "Melhorar o fôlego do cão e o seu",
      details: [
        "15-18 min correndo",
        "7-10 min caminhada"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "3-2",
      week: 3,
      day: 2,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objetivo: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "3-3",
      week: 3,
      day: 3,
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
      id: "3-4",
      week: 3,
      day: 4,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objetivo: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "3-5",
      week: 3,
      day: 5,
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
    {
      id: "3-6",
      week: 3,
      day: 6,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objetivo: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    // SEMANA 4 - Consolidando o Canicross (Iniciante)
    {
      id: "4-1",
      week: 4,
      day: 1,
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
      id: "4-2",
      week: 4,
      day: 2,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objetivo: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "4-3",
      week: 4,
      day: 3,
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
      id: "4-4",
      week: 4,
      day: 4,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objetivo: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    {
      id: "4-5",
      week: 4,
      day: 5,
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
    {
      id: "4-6",
      week: 4,
      day: 6,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objetivo: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Iniciante",
      completed: false
    },
    // NÍVEL INTERMEDIÁRIO - Semanas 1 e 2 (Construção de Ritmo e Força)
    {
      id: "int-1-1",
      week: 1,
      day: 1,
      category: "A",
      title: "Endurance (35–45 min)",
      description: "Corrida contínua em intensidade moderada",
      duration: "35-45 min",
      objective: "Aumentar a resistência do cão e sua capacidade aeróbica",
      details: [
        "10 min trote leve (aquecimento)",
        "20–25 min corrida contínua em intensidade moderada",
        "5–10 min caminhada e trote leve"
      ],
      difficulty: "Intermediário",
      completed: false,
      completedWeek1: false,
      completedWeek2: false
    },
    {
      id: "int-1-2",
      week: 1,
      day: 2,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objective: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    {
      id: "int-1-3",
      week: 1,
      day: 3,
      category: "B",
      title: "Intervalado de Força (25–30 min)",
      description: "Treino de força com tração intensa",
      duration: "25-30 min",
      objective: "Melhorar potência e tração",
      details: [
        "10 min aquecimento",
        "6 a 8 tiros de 45 segundos puxando forte",
        "Intervalo de 1 min caminhando entre os tiros",
        "5 min desaceleração"
      ],
      difficulty: "Intermediário",
      completed: false,
      completedWeek1: false,
      completedWeek2: false
    },
    {
      id: "int-1-4",
      week: 1,
      day: 4,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objective: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    {
      id: "int-1-5",
      week: 1,
      day: 5,
      category: "C",
      title: "Subidas (30–40 min)",
      description: "Treino em terreno com elevação",
      duration: "30-40 min",
      objetivo: "Fortalecimento muscular e comando sob esforço",
      details: [
        "10 min aquecimento",
        "6 subidas curtas de 60–90 segundos cada",
        "Desça caminhando (recuperação)",
        "10 min trote leve final"
      ],
      difficulty: "Intermediário",
      completed: false,
      completedWeek1: false,
      completedWeek2: false
    },
    {
      id: "int-1-6",
      week: 1,
      day: 6,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objetivo: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    // NÍVEL INTERMEDIÁRIO - Semanas 3 e 4 (Velocidade, Técnica e Terreno)
    {
      id: "int-2-1",
      week: 2,
      day: 1,
      category: "A",
      title: "Fartlek na trilha (35–45 min)",
      description: "Ritmo variando entre leve, moderado e forte",
      duration: "35-45 min",
      objective: "Adaptação ao terreno e resposta rápida aos comandos",
      details: [
        "Ritmo variando entre leve, moderado e forte conforme o terreno",
        "Exemplos: 4 min leve → 2 min forte",
        "5 min moderado → 1 min sprint"
      ],
      difficulty: "Intermediário",
      completed: false,
      completedWeek1: false,
      completedWeek2: false
    },
    {
      id: "int-2-2",
      week: 2,
      day: 2,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objective: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    {
      id: "int-2-3",
      week: 2,
      day: 3,
      category: "B",
      title: "Intervalado 2:1 (30–35 min)",
      description: "Treino intervalado de velocidade",
      duration: "30-35 min",
      objective: "Ganho de velocidade controlada",
      details: [
        "2 min corrida rápida com tração",
        "1 min trote/caminhada",
        "Repetir por 10 ciclos"
      ],
      difficulty: "Intermediário",
      completed: false,
      completedWeek1: false,
      completedWeek2: false
    },
    {
      id: "int-2-4",
      week: 2,
      day: 4,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objective: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    {
      id: "int-2-5",
      week: 2,
      day: 5,
      category: "C",
      title: "Trilhas técnicas (30–50 min)",
      description: "Terreno com curvas, raízes, subidas e descidas",
      duration: "30-50 min",
      objetivo: "Melhorar coordenação e segurança",
      details: [
        "Terreno com curvas, raízes, subidas e descidas",
        "Trabalhar comandos: direita, esquerda, devagar, vamos, para"
      ],
      difficulty: "Intermediário",
      completed: false,
      completedWeek1: false,
      completedWeek2: false
    },
    {
      id: "int-2-6",
      week: 2,
      day: 6,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objetivo: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    // NÍVEL INTERMEDIÁRIO - Semanas 5 e 6 (Consolidação + Intensidade)
    {
      id: "int-3-1",
      week: 3,
      day: 1,
      category: "A",
      title: "Longão (45–60 min)",
      description: "Terreno fácil, ritmo moderado",
      duration: "45-60 min",
      objective: "Resistência avançada",
      details: [
        "Terreno fácil, ritmo moderado",
        "Foque em constância e hidratação"
      ],
      difficulty: "Intermediário",
      completed: false,
      completedWeek1: false,
      completedWeek2: false
    },
    {
      id: "int-3-2",
      week: 3,
      day: 2,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objective: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    {
      id: "int-3-3",
      week: 3,
      day: 3,
      category: "B",
      title: "Sprints com tração (20–25 min)",
      description: "Treino de explosão e velocidade",
      duration: "20-25 min",
      objective: "Explosão do cão + velocidade sua",
      details: [
        "8 a 10 tiros de 20–30 segundos puxando forte",
        "1 min de recuperação entre eles"
      ],
      difficulty: "Intermediário",
      completed: false,
      completedWeek1: false,
      completedWeek2: false
    },
    {
      id: "int-3-4",
      week: 3,
      day: 4,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objective: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Intermediário",
      completed: false
    },
    {
      id: "int-3-5",
      week: 3,
      day: 5,
      category: "C",
      title: "Simulação de prova (30–40 min)",
      description: "Ritmo firme do início ao fim",
      duration: "30-40 min",
      objetivo: "Preparar dupla para competições ou treinos intensos",
      details: [
        "Ritmo firme do início ao fim",
        "Trabalhar largada, ultrapassagens e comandos"
      ],
      difficulty: "Intermediário",
      completed: false,
      completedWeek1: false,
      completedWeek2: false
    },
    {
      id: "int-3-6",
      week: 3,
      day: 6,
      category: "REST",
      title: "Dia de Descanso",
      description: "Recuperação é parte essencial do treino",
      duration: "Descanso",
      objetivo: "Permitir recuperação muscular e mental",
      details: [
        "Sem treino hoje",
        "Hidrate bem você e seu cão",
        "Alongamentos leves são bem-vindos"
      ],
      difficulty: "Intermediário",
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

  // ESTADO INICIAL FORÇADO - SEMPRE COMEÇAR DO ZERO
  useEffect(() => {
    // Inicializar progresso de semanas baseado no nível
    const maxWeeks = userLevel === "Iniciante" ? 4 : userLevel === "Intermediário" ? 3 : 5;
    const initialProgress: WeekProgress[] = [];
    for (let i = 1; i <= maxWeeks; i++) {
      initialProgress.push({
        weekNumber: i,
        unlocked: i === 1,
        completedWorkouts: 0,
        totalWorkouts: 3
      });
    }
    setWeekProgress(initialProgress);
    
    // Garantir que todos os treinos começam não concluídos
    setDailyWorkouts(prev => prev.map(w => ({ 
      ...w, 
      completed: false,
      completedWeek1: false,
      completedWeek2: false
    })));
  }, [userLevel]);

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
        setCurrentRunDistance(prev => prev + 0.002);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  // useEffect para desbloquear próximo nível automaticamente
  useEffect(() => {
    const levelWorkouts = dailyWorkouts.filter(
      w => w.difficulty === userLevel && w.category !== "REST"
    );

    const allCompleted =
      userLevel === "Intermediário"
        ? levelWorkouts.every(w => w.completedWeek1 && w.completedWeek2)
        : levelWorkouts.every(w => w.completed);

    if (!allCompleted) return;

    if (userLevel === "Iniciante") {
      setUnlockedLevels(prev =>
        prev.includes("Intermediário") ? prev : [...prev, "Intermediário"]
      );
    }

    if (userLevel === "Intermediário") {
      setUnlockedLevels(prev =>
        prev.includes("Avançado") ? prev : [...prev, "Avançado"]
      );
    }
  }, [dailyWorkouts, userLevel]);

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

  // Verificar se semana está desbloqueada
  const isWeekUnlocked = (weekNum: number): boolean => {
    const week = weekProgress.find(w => w.weekNumber === weekNum);
    return week?.unlocked || false;
  };

  // Obter treinos de uma semana (apenas A, B, C - sem REST)
  const getWeekWorkouts = (weekNum: number) => {
    return dailyWorkouts.filter(
      w => w.week === weekNum && 
      w.difficulty === userLevel && 
      w.category !== "REST"
    );
  };

  // Verificar se treino anterior foi concluído (dentro da mesma semana)
  const isPreviousWorkoutCompleted = (workoutId: string): boolean => {
    const currentWorkout = dailyWorkouts.find(w => w.id === workoutId);
    if (!currentWorkout) return false;
    
    const weekWorkouts = getWeekWorkouts(currentWorkout.week);
    const currentIndex = weekWorkouts.findIndex(w => w.id === workoutId);
    
    // Se é o primeiro treino da semana (Treino A)
    if (currentIndex === 0) return true;
    
    // Verificar se o treino anterior foi concluído
    const previousWorkout = weekWorkouts[currentIndex - 1];
    
    // Para nível intermediário, verificar conclusão específica da semana
    if (userLevel === "Intermediário") {
      // Lógica será implementada no toggle
      return previousWorkout?.completed || false;
    }
    
    return previousWorkout?.completed || false;
  };

  // Verificar se pode DESMARCAR um treino
  const canUncheckWorkout = (workoutId: string): boolean => {
    const currentWorkout = dailyWorkouts.find(w => w.id === workoutId);
    if (!currentWorkout || !currentWorkout.completed) return false;
    
    const weekWorkouts = getWeekWorkouts(currentWorkout.week);
    const currentIndex = weekWorkouts.findIndex(w => w.id === workoutId);
    
    // Verificar se há treinos posteriores concluídos
    for (let i = currentIndex + 1; i < weekWorkouts.length; i++) {
      if (weekWorkouts[i].completed) {
        return false; // Não pode desmarcar se há treinos posteriores concluídos
      }
    }
    
    return true; // Pode desmarcar se não há treinos posteriores concluídos
  };

  // Verificar se pode MARCAR um treino
  const canCheckWorkout = (workoutId: string): boolean => {
    const workout = dailyWorkouts.find(w => w.id === workoutId);
    if (!workout) return false;
    
    // Verificar se a semana está desbloqueada
    if (!isWeekUnlocked(workout.week)) return false;
    
    // Verificar se o treino anterior foi concluído
    if (!isPreviousWorkoutCompleted(workoutId)) return false;
    
    return true;
  };

  // Desbloquear próxima semana
  const unlockNextWeek = (currentWeek: number) => {
    setWeekProgress(prev => prev.map(week => {
      if (week.weekNumber === currentWeek + 1) {
        return { ...week, unlocked: true };
      }
      return week;
    }));
  };

  // Bloquear próxima semana (quando desmarcar Treino C)
  const lockNextWeek = (currentWeek: number) => {
    setWeekProgress(prev => prev.map(week => {
      if (week.weekNumber === currentWeek + 1) {
        return { ...week, unlocked: false };
      }
      return week;
    }));
  };

  // Função principal de toggle
  const toggleWorkoutCompletion = (workoutId: string, weekNumber?: 1 | 2) => {
    const workout = dailyWorkouts.find(w => w.id === workoutId);
    if (!workout || workout.category === "REST") return;
    
    // LÓGICA PARA NÍVEL INTERMEDIÁRIO
    if (userLevel === "Intermediário" && weekNumber) {
      const weekKey = weekNumber === 1 ? "completedWeek1" : "completedWeek2";
      const isCurrentlyCompleted = workout[weekKey];
      
      // Se está tentando MARCAR
      if (!isCurrentlyCompleted) {
        if (!canCheckWorkout(workoutId)) {
          setShowBlockedMessage(true);
          setTimeout(() => setShowBlockedMessage(false), 3000);
          return;
        }
        
        // Marcar treino para a semana específica
        setDailyWorkouts(prev => prev.map(w => {
          if (w.id === workoutId) {
            const updated = { ...w, [weekKey]: true };
            // Atualizar completed geral se ambas semanas estiverem completas
            if (updated.completedWeek1 && updated.completedWeek2) {
              updated.completed = true;
            }
            return updated;
          }
          return w;
        }));
        
        // Verificar se completou a semana
        const weekWorkouts = getWeekWorkouts(workout.week);
        const allWeekCompleted = weekWorkouts.every(w => {
          if (w.id === workoutId) return true;
          return w[weekKey] || false;
        });
        
        if (allWeekCompleted) {
          setTimeout(() => {
            const completedCount = weekWorkouts.length;
            const totalTime = weekWorkouts.reduce((acc, w) => {
              const time = parseInt(w.duration.match(/\d+/)?.[0] || "0");
              return acc + time;
            }, 0);
            
            const workoutTypes = weekWorkouts.map(w => w.title);
            
            const summary: WeeklySummary = {
              weekNumber: workout.week,
              completedWorkouts: completedCount,
              totalTime,
              workoutTypes,
              isRepeat: weekNumber === 2
            };
            
            setCurrentWeeklySummary(summary);
            setShowWeeklySummary(true);
            
            // Se completou a segunda semana, desbloquear próximo bloco
            if (weekNumber === 2) {
              unlockNextWeek(workout.week);
            }
          }, 300);
        }
      }
      // Se está tentando DESMARCAR
      else {
        // Desmarcar treino para a semana específica
        setDailyWorkouts(prev => prev.map(w => {
          if (w.id === workoutId) {
            const updated = { ...w, [weekKey]: false, completed: false };
            return updated;
          }
          return w;
        }));
        
        // Se desmarcou da semana 2, bloquear próximo bloco
        if (weekNumber === 2) {
          const weekWorkouts = getWeekWorkouts(workout.week);
          const isLastWorkout = weekWorkouts[weekWorkouts.length - 1].id === workoutId;
          if (isLastWorkout) {
            lockNextWeek(workout.week);
          }
        }
      }
      
      return;
    }
    
    // LÓGICA PARA INICIANTE E AVANÇADO (original)
    if (!workout.completed) {
      if (!canCheckWorkout(workoutId)) {
        setShowBlockedMessage(true);
        setTimeout(() => setShowBlockedMessage(false), 3000);
        return;
      }
      
      setDailyWorkouts(prev => prev.map(w => 
        w.id === workoutId ? { ...w, completed: true } : w
      ));
      
      const weekWorkouts = getWeekWorkouts(workout.week);
      const isLastWorkout = weekWorkouts[weekWorkouts.length - 1].id === workoutId;
      
      if (isLastWorkout) {
        setTimeout(() => {
          const completedCount = weekWorkouts.length;
          const totalTime = weekWorkouts.reduce((acc, w) => {
            const time = parseInt(w.duration.match(/\d+/)?.[0] || "0");
            return acc + time;
          }, 0);
          
          const workoutTypes = weekWorkouts.map(w => w.title);
          
          const summary: WeeklySummary = {
            weekNumber: workout.week,
            completedWorkouts: completedCount,
            totalTime,
            workoutTypes
          };
          
          setCurrentWeeklySummary(summary);
          setShowWeeklySummary(true);
          
          unlockNextWeek(workout.week);
        }, 300);
      }
    } 
    else {
      if (!canUncheckWorkout(workoutId)) {
        setShowBlockedMessage(true);
        setTimeout(() => setShowBlockedMessage(false), 3000);
        return;
      }
      
      setDailyWorkouts(prev => prev.map(w => 
        w.id === workoutId ? { ...w, completed: false } : w
      ));
      
      const weekWorkouts = getWeekWorkouts(workout.week);
      const isLastWorkout = weekWorkouts[weekWorkouts.length - 1].id === workoutId;
      
      if (isLastWorkout) {
        lockNextWeek(workout.week);
      }
    }
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

  // Verificar se o nível atual está completo
  const isCurrentLevelComplete = () => {
    const currentLevelWorkouts = dailyWorkouts.filter(w => w.difficulty === userLevel && w.category !== "REST");
    
    if (userLevel === "Intermediário") {
      return currentLevelWorkouts.every(w => w.completedWeek1 && w.completedWeek2);
    }
    
    return currentLevelWorkouts.every(w => w.completed);
  };

  // Verificar se um nível está desbloqueado
  const isLevelUnlocked = (level: "Iniciante" | "Intermediário" | "Avançado") => {
    return unlockedLevels.includes(level);
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
      {/* Blocked Message */}
      {showBlockedMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5">
          <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border-2 border-red-600">
            <AlertCircle className="w-6 h-6" />
            <div className="font-bold">Complete a etapa anterior para continuar evoluindo.</div>
          </div>
        </div>
      )}

      {/* Weekly Summary Dialog */}
      <Dialog open={showWeeklySummary} onOpenChange={setShowWeeklySummary}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-400">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-green-900">
              <Trophy className="w-8 h-8 text-green-600" />
              {currentWeeklySummary?.isRepeat ? "Repetição Concluída! 🎉" : `Resumo da Semana ${currentWeeklySummary?.weekNumber} 🎉`}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-base text-green-800 mt-4">
                {currentWeeklySummary && (
                  <div className="space-y-4">
                    <div className="font-semibold text-lg">
                      {currentWeeklySummary.isRepeat 
                        ? `Parabéns! Você completou a segunda rodada dos treinos!`
                        : `Parabéns! Você concluiu ${currentWeeklySummary.completedWorkouts} treinos essa semana!`
                      }
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>⏱️ Tempo total:</strong> {currentWeeklySummary.totalTime} minutos
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>🏃 Treinos realizados:</strong>
                      </div>
                      <ul className="text-xs text-gray-600 ml-4 space-y-1">
                        {currentWeeklySummary.workoutTypes.map((type, idx) => (
                          <li key={idx}>• {type}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-base font-semibold text-green-900">
                      Você deu um grande passo na evolução com seu cachorro! 🐕💙
                    </div>
                    
                    {userLevel === "Intermediário" && !currentWeeklySummary.isRepeat && (
                      <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg border-2 border-blue-400">
                        <div className="text-sm font-bold text-blue-900 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          Agora repita os mesmos treinos na segunda semana!
                        </div>
                      </div>
                    )}
                    
                    {userLevel === "Intermediário" && currentWeeklySummary.isRepeat && (
                      <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg border-2 border-green-400">
                        <div className="text-sm font-bold text-green-900 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          Bloco completo! Próximo bloco desbloqueado!
                        </div>
                      </div>
                    )}
                    
                    {userLevel !== "Intermediário" && currentWeeklySummary.weekNumber < 4 && (
                      <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg border-2 border-green-400">
                        <div className="text-sm font-bold text-green-900 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          A próxima semana já está liberada!
                        </div>
                      </div>
                    )}
                    
                    {isCurrentLevelComplete() && (
                      <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-4 rounded-lg border-2 border-yellow-400">
                        <div className="text-sm font-bold text-yellow-900 flex items-center gap-2">
                          <Trophy className="w-5 h-5" />
                          Parabéns! Você concluiu o nível {userLevel}!
                        </div>
                        {userLevel === "Iniciante" && (
                          <div className="text-xs text-yellow-800 mt-2">
                            O nível Intermediário foi desbloqueado!
                          </div>
                        )}
                        {userLevel === "Intermediário" && (
                          <div className="text-xs text-yellow-800 mt-2">
                            O nível Avançado foi desbloqueado!
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button 
              onClick={() => setShowWeeklySummary(false)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8"
            >
              Continuar Treinando! 💪
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dog className="w-8 h-8 sm:w-10 sm:h-10" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Stride</h1>
                <div className="text-xs sm:text-sm text-blue-100">Canicross para Iniciantes</div>
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
                      <div className="text-blue-100 text-sm mt-1">quilômetros</div>
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
                      <div className="text-cyan-100 text-sm mt-1">corridas registradas</div>
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
                      <div className="text-sky-100 text-sm mt-1">min/km</div>
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
                          Treinos Semanais - Programa Estruturado
                        </CardTitle>
                        <CardDescription>Sistema de treino com dias de descanso e progressão controlada</CardDescription>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant={userLevel === "Iniciante" ? "default" : "outline"}
                          onClick={() => isLevelUnlocked("Iniciante") && setUserLevel("Iniciante")}
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
                    {/* Renderização específica para Intermediário */}
                    {userLevel === "Intermediário" ? (
                      <>
                        {[1, 2, 3].map(blockNum => {
                          const weekWorkouts = filteredWorkouts.filter(w => w.week === blockNum);
                          if (weekWorkouts.length === 0) return null;

                          const isUnlocked = isWeekUnlocked(blockNum);
                          const actualWorkouts = getWeekWorkouts(blockNum);

                          return (
                            <div key={blockNum} className="space-y-3">
                              <div className="flex items-center gap-3 mt-6 mb-3">
                                <div className="h-px bg-indigo-300 flex-1"></div>
                                <div className="flex items-center gap-3">
                                  {!isUnlocked && <Lock className="w-5 h-5 text-gray-500" />}
                                  <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    {blockNum === 1 && "Semanas 1 e 2 – Construção de Ritmo e Força"}
                                    {blockNum === 2 && "Semanas 3 e 4 – Velocidade, Técnica e Terreno"}
                                    {blockNum === 3 && "Semanas 5 e 6 – Consolidação + Intensidade"}
                                  </h3>
                                </div>
                                <div className="h-px bg-indigo-300 flex-1"></div>
                              </div>

                              {!isUnlocked && (
                                <div className="p-4 bg-gray-100 border-2 border-gray-300 rounded-xl mb-4">
                                  <div className="flex items-center gap-3">
                                    <Lock className="w-6 h-6 text-gray-500" />
                                    <div>
                                      <div className="font-bold text-gray-700 text-sm">Bloco Bloqueado</div>
                                      <div className="text-xs text-gray-600">Complete o bloco anterior (ambas as semanas) para desbloquear.</div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {actualWorkouts.map((workout) => {
                                const canAccessWeek1 = workout.completedWeek1 || canCheckWorkout(workout.id);
                                const canAccessWeek2 = workout.completedWeek2 || (workout.completedWeek1 && canCheckWorkout(workout.id));
                                const isBlocked = !isUnlocked;
                                
                                return (
                                  <div 
                                    key={workout.id}
                                    className={`p-5 rounded-xl border-2 ${
                                      workout.completed 
                                        ? 'bg-green-50 border-green-300' 
                                        : 'bg-white border-indigo-300'
                                    }`}
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className={`w-12 h-12 ${
                                        isBlocked
                                          ? "bg-gray-400"
                                          : workout.completed
                                            ? "bg-green-500"
                                            : "bg-indigo-500"
                                      } rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                                        {isBlocked ? (
                                          <Lock className="w-6 h-6 text-white" />
                                        ) : workout.completed ? (
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
                                          <Badge className="bg-indigo-500 text-white">
                                            {workout.duration}
                                          </Badge>
                                        </div>
                                        
                                        <div className={`text-sm font-semibold mb-2 ${workout.completed ? 'text-gray-400' : 'text-indigo-700'}`}>
                                          🎯 Objetivo: {workout.objective}
                                        </div>
                                        
                                        <div className={`text-sm ${workout.completed ? 'text-gray-400' : 'text-gray-700'} mb-3`}>
                                          {workout.description}
                                        </div>

                                        <div className={`text-xs ${workout.completed ? 'text-gray-400' : 'text-gray-600'} space-y-1 mb-3 pl-4`}>
                                          {workout.details.map((detail, idx) => (
                                            <div key={idx}>• {detail}</div>
                                          ))}
                                        </div>

                                        {/* Checkboxes duplos para Intermediário */}
                                        <div className="flex items-center gap-4 mt-4">
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="checkbox"
                                              checked={workout.completedWeek1 || false}
                                              onChange={() => !isBlocked && toggleWorkoutCompletion(workout.id, 1)}
                                              disabled={isBlocked || !canAccessWeek1}
                                              className="w-5 h-5 rounded border-2 border-indigo-400 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Semana {blockNum * 2 - 1}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="checkbox"
                                              checked={workout.completedWeek2 || false}
                                              onChange={() => !isBlocked && toggleWorkoutCompletion(workout.id, 2)}
                                              disabled={isBlocked || !canAccessWeek2}
                                              className="w-5 h-5 rounded border-2 border-indigo-400 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Semana {blockNum * 2}</span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-3">
                                          <Badge variant="outline" className={workout.completed ? 'border-green-500 text-green-700' : ''}>
                                            {workout.difficulty}
                                          </Badge>
                                          {workout.completed && (
                                            <div className="flex items-center gap-1">
                                              <span className="text-2xl">🏅</span>
                                              <span className="text-xs text-green-600 font-semibold">Concluído (2x)</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      /* Renderização para Iniciante e Avançado (original) */
                      <>
                        {[1, 2, 3, 4].map(weekNum => {
                          const weekWorkouts = filteredWorkouts.filter(w => w.week === weekNum);
                          if (weekWorkouts.length === 0) return null;

                          const isUnlocked = isWeekUnlocked(weekNum);
                          const weekInfo = weekProgress.find(w => w.weekNumber === weekNum);
                          const actualWorkouts = getWeekWorkouts(weekNum);

                          return (
                            <div key={weekNum} className="space-y-3">
                              <div className="flex items-center gap-3 mt-6 mb-3">
                                <div className="h-px bg-blue-300 flex-1"></div>
                                <div className="flex items-center gap-3">
                                  {!isUnlocked && <Lock className="w-5 h-5 text-gray-500" />}
                                  <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Semana {weekNum}
                                    {weekNum === 1 && " - Adaptação e Comandos"}
                                    {weekNum === 2 && " - Introdução à Tração"}
                                    {weekNum === 3 && " - Resistência e Ritmo"}
                                    {weekNum === 4 && " - Consolidando o Canicross"}
                                  </h3>
                                  {weekInfo && (
                                    <Badge className={isUnlocked ? "bg-green-500" : "bg-gray-400"}>
                                      {actualWorkouts.filter(w => w.completed).length}/{actualWorkouts.length}
                                    </Badge>
                                  )}
                                </div>
                                <div className="h-px bg-blue-300 flex-1"></div>
                              </div>

                              {!isUnlocked && (
                                <div className="p-4 bg-gray-100 border-2 border-gray-300 rounded-xl mb-4">
                                  <div className="flex items-center gap-3">
                                    <Lock className="w-6 h-6 text-gray-500" />
                                    <div>
                                      <div className="font-bold text-gray-700 text-sm">Semana Bloqueada</div>
                                      <div className="text-xs text-gray-600">Complete todos os treinos da semana anterior para desbloquear.</div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {weekWorkouts.map((workout) => {
                                const canAccess = workout.category === "REST" ? false : (
                                  workout.completed || canCheckWorkout(workout.id)
                                );
                                const isBlocked = !isUnlocked || (!canAccess && workout.category !== "REST");
                                
                                return (
                                  <div 
                                    key={workout.id}
                                    className={`p-5 rounded-xl border-2 ${
                                      workout.category === "REST" 
                                        ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300" 
                                        : workout.completed 
                                          ? 'bg-green-50 border-green-300' 
                                          : canAccess
                                            ? 'bg-white border-blue-300 hover:shadow-lg transition-all cursor-pointer'
                                            : 'bg-gray-50 border-gray-300 opacity-60'
                                    }`}
                                    onClick={() => !isBlocked && workout.category !== "REST" && toggleWorkoutCompletion(workout.id)}
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className={`w-12 h-12 ${
                                        workout.category === "REST" 
                                          ? "bg-gradient-to-br from-amber-400 to-orange-500" 
                                          : isBlocked
                                            ? "bg-gray-400"
                                            : getLevelColor(workout.difficulty)
                                      } rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                                        {workout.category === "REST" ? (
                                          <Coffee className="w-6 h-6 text-white" />
                                        ) : isBlocked ? (
                                          <Lock className="w-6 h-6 text-white" />
                                        ) : workout.completed ? (
                                          <CheckCircle2 className="w-6 h-6 text-white" />
                                        ) : (
                                          <span className="text-white font-bold text-lg">{workout.category}</span>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            {workout.category === "REST" ? (
                                              <Badge className="bg-amber-600 text-white font-bold">
                                                Descanso
                                              </Badge>
                                            ) : (
                                              <Badge className="bg-blue-600 text-white font-bold">
                                                Treino {workout.category}
                                              </Badge>
                                            )}
                                            <h3 className={`font-bold text-lg ${workout.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                              {workout.title}
                                            </h3>
                                          </div>
                                          <Badge className={`${
                                            workout.category === "REST" 
                                              ? "bg-amber-500" 
                                              : getLevelColor(workout.difficulty)
                                          } text-white`}>
                                            {workout.duration}
                                          </Badge>
                                        </div>
                                        
                                        {workout.category === "REST" ? (
                                          <div className="bg-amber-100 p-3 rounded-lg border border-amber-300 mb-3">
                                            <div className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                                              <Coffee className="w-4 h-4" />
                                              Dia de descanso – recuperação é parte do treino
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <div className={`text-sm font-semibold mb-2 ${workout.completed ? 'text-gray-400' : 'text-blue-700'}`}>
                                              🎯 Objetivo: {workout.objective}
                                            </div>
                                            
                                            <div className={`text-sm ${workout.completed ? 'text-gray-400' : 'text-gray-700'} mb-3`}>
                                              {workout.description}
                                            </div>

                                            <div className={`text-xs ${workout.completed ? 'text-gray-400' : 'text-gray-600'} space-y-1 mb-3 pl-4`}>
                                              {workout.details.map((detail, idx) => (
                                                <div key={idx}>• {detail}</div>
                                              ))}
                                            </div>
                                          </>
                                        )}

                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className={workout.completed ? 'border-green-500 text-green-700' : ''}>
                                            {workout.difficulty}
                                          </Badge>
                                          {workout.completed && workout.category !== "REST" && (
                                            <div className="flex items-center gap-1">
                                              <span className="text-2xl">🏅</span>
                                              <span className="text-xs text-green-600 font-semibold">Concluído</span>
                                            </div>
                                          )}
                                          {isBlocked && workout.category !== "REST" && (
                                            <div className="flex items-center gap-1">
                                              <Lock className="w-4 h-4 text-gray-500" />
                                              <span className="text-xs text-gray-500 font-semibold">Bloqueado</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </>
                    )}

                    {/* Mensagem final após completar todas as semanas */}
                    {isCurrentLevelComplete() && (
                      <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-xl mt-6">
                        <div className="flex items-center gap-4">
                          <Trophy className="w-12 h-12 text-green-600" />
                          <div>
                            <div className="font-bold text-green-900 text-lg">🎉 Parabéns! Programa {userLevel} Completo!</div>
                            <div className="text-sm text-green-700 mt-1">
                              {userLevel === "Iniciante" && "O nível Intermediário foi desbloqueado! Continue evoluindo."}
                              {userLevel === "Intermediário" && "O nível Avançado foi desbloqueado! Você está quase lá!"}
                              {userLevel === "Avançado" && "Você dominou o Canicross! Continue treinando para manter a forma."}
                            </div>
                          </div>
                        </div>
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
                          <div className="text-xs text-green-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Meta alcançada! Continue assim!
                          </div>
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
                        <div>Nenhuma corrida registrada ainda.</div>
                        <div className="text-sm mt-1">Comece sua primeira corrida na aba &quot;Correr&quot;!</div>
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
                                <div className="font-semibold text-sm sm:text-base">
                                  {run.distance.toFixed(2)} km
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600">
                                  {new Date(run.date).toLocaleDateString('pt-BR')}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{formatDuration(run.duration)}</div>
                              <div className="text-xs text-gray-600">{run.pace.toFixed(1)} min/km</div>
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
                        <div className="text-sm text-gray-600 mb-1">Tempo</div>
                        <div className="text-2xl sm:text-3xl font-bold text-blue-900">
                          {formatTime(currentRunTime)}
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-md border-2 border-cyan-200 text-center">
                        <MapPin className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                        <div className="text-sm text-gray-600 mb-1">Distância</div>
                        <div className="text-2xl sm:text-3xl font-bold text-cyan-900">
                          {currentRunDistance.toFixed(2)} km
                        </div>
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
                        <div className="text-center text-sm font-medium text-blue-900">
                          {isPaused ? "⏸️ Corrida pausada" : "🏃 Corrida em andamento..."}
                        </div>
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
                      <div className="text-sm">Mantenha água disponível para você e seu cão</div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-sky-200">
                      <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sky-700 font-bold">2</span>
                      </div>
                      <div className="text-sm">Respeite os dias de descanso - recuperação é essencial</div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-sky-200">
                      <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sky-700 font-bold">3</span>
                      </div>
                      <div className="text-sm">Observe os sinais de cansaço do seu cão</div>
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
                          <div className="text-sm text-gray-700 mb-3">
                            Aprenda sobre coleiras, cintos e linhas de tração adequadas para Canicross. O equipamento correto garante segurança e conforto para você e seu cão.
                          </div>
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
                          <div className="text-sm text-gray-700 mb-3">
                            Como começar a treinar com seu cão, comandos básicos e adaptação gradual. Construa uma base sólida para evoluir com segurança.
                          </div>
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
                          <div className="text-sm text-gray-700 mb-3">
                            Aprenda técnicas de respiração, postura avançada e sincronização perfeita com seu cão. Melhore seu ritmo e eficiência nas corridas.
                          </div>
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
                          <div className="text-sm text-gray-700 mb-3">
                            Crie planos de treino estruturados, estabeleça metas progressivas e aprenda a balancear intensidade com recuperação adequada.
                          </div>
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
                          <div className="text-sm text-gray-700 mb-3">
                            Entenda as necessidades nutricionais para atletas caninos, suplementação adequada e estratégias de hidratação para treinos intensos.
                          </div>
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
                          <div className="text-sm text-gray-700 mb-3">
                            Estratégias de treino pré-competição, periodização avançada, análise de performance e técnicas mentais para alcançar o pódio.
                          </div>
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
                          <div className="text-sm text-gray-700 mb-3">
                            Use dados e métricas avançadas para otimizar treinos. Análise de ritmo, frequência cardíaca, VO2 máx e estratégias de recuperação científica.
                          </div>
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
                          <div className="text-sm text-gray-700 mb-3">
                            Técnicas de atletas profissionais, treinos intervalados de alta intensidade (HIIT), periodização dupla e tripla, e preparação para ultramaratonas.
                          </div>
                          <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">Pro</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-5 rounded-xl border-2 border-amber-400 mt-4">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-amber-600" />
                        <div>
                          <div className="font-bold text-amber-900">Conquiste o Próximo Nível</div>
                          <div className="text-sm text-amber-800">Continue evoluindo e alcance a excelência no Canicross!</div>
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
                              <div className="text-sm text-gray-700 mb-4">{post.content}</div>
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

                {/* Achievements */}
                <Card className="shadow-2xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 relative overflow-hidden">
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
                      <div className="flex flex-col items-center p-5 bg-white rounded-2xl border-4 border-yellow-400 shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer relative">
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl">✓</span>
                        </div>
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center mb-3 shadow-2xl animate-pulse">
                          <Award className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                        <div className="text-xs text-center font-bold text-gray-900">Primeira Corrida</div>
                        <div className="text-[10px] text-center text-yellow-700 font-semibold mt-1">🎖️ Desbloqueado!</div>
                      </div>

                      <div className="flex flex-col items-center p-5 bg-white rounded-2xl border-4 border-blue-400 shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer relative">
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl">✓</span>
                        </div>
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500 rounded-full flex items-center justify-center mb-3 shadow-2xl animate-pulse">
                          <MapPin className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                        <div className="text-xs text-center font-bold text-gray-900">10km Total</div>
                        <div className="text-[10px] text-center text-blue-700 font-semibold mt-1">🎖️ Desbloqueado!</div>
                      </div>

                      <div className="flex flex-col items-center p-5 bg-white rounded-2xl border-4 border-green-400 shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer relative">
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl">✓</span>
                        </div>
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-3 shadow-2xl animate-pulse">
                          <Activity className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                        <div className="text-xs text-center font-bold text-gray-900">5 Corridas</div>
                        <div className="text-[10px] text-center text-green-700 font-semibold mt-1">🎖️ Desbloqueado!</div>
                      </div>

                      <div className="flex flex-col items-center p-5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-4 border-gray-300 shadow-lg opacity-60 hover:opacity-80 transition-all duration-300 cursor-pointer relative">
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl">🔒</span>
                        </div>
                        <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center mb-3 shadow-lg">
                          <Trophy className="w-10 h-10 text-gray-600" />
                        </div>
                        <div className="text-xs text-center font-bold text-gray-700">50km Total</div>
                        <div className="text-[10px] text-center text-gray-600 font-semibold mt-1">🔒 Bloqueado</div>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 rounded-2xl border-2 border-yellow-400 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-900">Progresso Geral</span>
                        <span className="text-sm font-bold text-yellow-700">3/4 Conquistas</span>
                      </div>
                      <Progress value={75} className="h-4 bg-yellow-200" />
                      <div className="text-xs text-center text-gray-700 font-semibold mt-3">
                        🎯 Continue assim! Você está quase lá!
                      </div>
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
