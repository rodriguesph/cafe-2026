import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  CalendarCheck, 
  Award, 
  LogOut, 
  User, 
  CheckCircle, 
  Lock, 
  FileText, 
  Star, 
  Brain, 
  MonitorPlay,
  Loader2,
  Download,
  X,
  Trash2,
  Key,
  Eye,
  LayoutDashboard,
  List,
  Search,
  AlertTriangle,
  PlayCircle,
  Clock,
  ExternalLink,
  Video,
  MapPin,
  BarChart
} from 'lucide-react';

// --- IMPORTAÇÕES FIREBASE (SDK Modular) ---
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where 
} from "firebase/firestore";

/**
 * --- CONFIGURAÇÃO FIREBASE ---
 */
const firebaseConfig = {
  apiKey: "AIzaSyAXpFaUihMehQp9m6ZJ4aKNp8FNl0OO0ug",
  authDomain: "cafe-2026.firebaseapp.com",
  projectId: "cafe-2026",
  storageBucket: "cafe-2026.firebasestorage.app",
  messagingSenderId: "234308079212",
  appId: "1:234308079212:web:946672d38f1486d3cdd249",
  measurementId: "G-RV1JHKYYRD"
};

const USE_REAL_FIREBASE = true; 

// --- INICIALIZAÇÃO CONDICIONAL ---
let dbReal = null;
if (USE_REAL_FIREBASE) {
  try {
    const app = initializeApp(firebaseConfig);
    dbReal = getFirestore(app);
    console.log("🔥 Firebase Online");
  } catch (e) {
    console.error("Erro Firebase:", e);
  }
}

// --- DADOS ESTRUTURAIS ---

const AREA_OPTIONS = [ // Antigo Colegiado
  "Agrárias",
  "Arquitetura e Engenharias",
  "Colégio",
  "Direito",
  "Gestão e Tecnologia",
  "Medicina",
  "Odontologia",
  "Saúde 1",
  "Saúde 2",
  "Educação Infantil",
  "Fundamental I",
  "Fundamental II",
  "Ensino Médio"
];

const UNIT_OPTIONS = [
  "Campo Mourão",
  "Macapá"
];

const ATTENDANCE_PASSWORDS = {
  '26/01': 'inovação',     
  '28/01': 'experiência',
  '29/01': 'eficiência'
};

const EVENT_DAYS = [
  { id: 'day_26', label: '26/01 - Abertura & Palestra' },
  { id: 'day_27', label: '27/01 - Assíncrono' },
  { id: 'day_28', label: '28/01 - Síncrono (Meet)' },
  { id: 'day_29', label: '29/01 - Workshop Presencial' }
];

const TRACKS = {
  'MA': { 
    id: 'MA', 
    name: 'Metodologias de Aprendizagem', 
    icon: Brain, 
    desc: 'Foco no aluno protagonista e aprendizagem ativa.',
    embedUrl: "https://www.canva.com/design/DAG6jhGkdZE/OkMH0yFRrfjEH4OR-C3DCQ/view?embed",
    linkUrl: "https://www.canva.com/design/DAG6jhGkdZE/OkMH0yFRrfjEH4OR-C3DCQ/view",
    meetUrl: "https://meet.google.com/vvq-dyek-thw",
    author: "Paulo Rodrigues"
  },
  'IA': { 
    id: 'IA', 
    name: 'Inteligência Artificial', 
    icon: MonitorPlay, 
    desc: 'Uso de dados, automação e IA na educação.',
    embedUrl: "https://www.canva.com/design/DAG6joTcFa0/mYcPMfZsn4eoWxXN6qU5bw/view?embed",
    linkUrl: "https://www.canva.com/design/DAG6joTcFa0/mYcPMfZsn4eoWxXN6qU5bw/view",
    meetUrl: "https://meet.google.com/ksv-zhnp-aza",
    author: "Paulo Rodrigues"
  },
  'AV': { 
    id: 'AV', 
    name: 'Avaliação', 
    icon: BarChart, 
    desc: 'Rubricas, feedback e avaliação formativa.',
    embedUrl: "https://www.canva.com/design/DAG6jqrsnWQ/D2dbgGOZCLoxmXhsIjKcCw/view?embed",
    linkUrl: "https://www.canva.com/design/DAG6jqrsnWQ/D2dbgGOZCLoxmXhsIjKcCw/view",
    meetUrl: "https://meet.google.com/jrw-rbrc-wfc",
    author: "Paulo Rodrigues"
  },
  'CD': { 
    id: 'CD', 
    name: 'Conteúdos Digitais', 
    icon: FileText, 
    desc: 'Curadoria e produção para EAD e Híbrido.',
    embedUrl: "https://www.canva.com/design/DAG6jk5AiIM/tJ-fFBuJX7xtYETwzyU_Vg/view?embed",
    linkUrl: "https://www.canva.com/design/DAG6jk5AiIM/tJ-fFBuJX7xtYETwzyU_Vg/view",
    meetUrl: "https://meet.google.com/gou-iwsm-wfk",
    author: "Paulo Rodrigues"
  }
};

const CATEGORY_MAP = {
  'soma_metodologia': 'MA',
  'soma_ia': 'IA',
  'soma_avaliacao': 'AV',
  'soma_digital': 'CD'
};

const QUESTIONS = [
  {
    text: "01) Como você descreve a dinâmica predominante das suas aulas atuais?",
    options: [
      { text: "Expositiva, com foco na transmissão de conteúdo pelo professor", cat: 'soma_metodologia', pts: 3 },
      { text: "Mista, com alguns momentos de interação esporádica", cat: 'soma_metodologia', pts: 2 },
      { text: "Totalmente ativa, com os alunos liderando a construção do saber", cat: 'soma_metodologia', pts: 0 }
    ]
  },
  {
    text: "02) Qual é sua maior dificuldade ao tentar inovar na sala de aula?",
    options: [
      { text: "Falta de engajamento e participação dos alunos", cat: 'soma_metodologia', pts: 4 },
      { text: "Falta de tempo para preparar dinâmicas complexas", cat: 'soma_metodologia', pts: 1 },
      { text: "Não tenho dificuldades, meus alunos são muito participativos", cat: 'soma_metodologia', pts: 0 }
    ]
  },
  {
    text: "03) Você se sente confortável aplicando metodologias como PBL, TBL ou Sala de Aula Invertida?",
    options: [
      { text: "Conheço a teoria, mas travo na aplicação prática", cat: 'soma_metodologia', pts: 3 },
      { text: "Nunca ouvi falar ou conheço muito pouco", cat: 'soma_metodologia', pts: 3 },
      { text: "Aplico frequentemente e com segurança", cat: 'soma_metodologia', pts: 0 }
    ]
  },
  {
    text: "04) Ao final da aula, como você valida se os alunos atingiram o objetivo de aprendizagem?",
    options: [
      { text: "Pergunto 'alguém tem dúvida?' e sigo em frente", cat: 'soma_metodologia', pts: 3 },
      { text: "Faço um quiz rápido ou atividade prática de verificação", cat: 'soma_metodologia', pts: 0 },
      { text: "Geralmente só descubro na hora da prova", cat: 'soma_metodologia', pts: 3 }
    ]
  },
  {
    text: "05) Qual é a sua relação atual com ferramentas de IA (como ChatGPT, Claude, Copilot)?",
    options: [
      { text: "Uso diariamente para otimizar meu trabalho", cat: 'soma_ia', pts: 0 },
      { text: "Já brinquei algumas vezes, mas não uso profissionalmente", cat: 'soma_ia', pts: 2 },
      { text: "Nunca usei ou tenho receio de usar", cat: 'soma_ia', pts: 3 }
    ]
  },
  {
    text: "06) Quanto tempo você gasta planejando aulas e criando materiais do zero?",
    options: [
      { text: "Muitas horas. É a parte mais exaustiva do trabalho", cat: 'soma_ia', pts: 3 },
      { text: "Um tempo razoável, mas gostaria de ser mais rápido", cat: 'soma_ia', pts: 2 },
      { text: "Sou muito ágil, tenho meus processos dominados", cat: 'soma_ia', pts: 0 }
    ]
  },
  {
    text: "07) Você saberia criar um prompt estruturado para gerar um plano de aula completo em segundos?",
    options: [
      { text: "Não faço ideia do que é um prompt estruturado", cat: 'soma_ia', pts: 3 },
      { text: "Tenho uma noção básica, mas o resultado nem sempre é bom", cat: 'soma_ia', pts: 2 },
      { text: "Sim, domino a engenharia de prompts", cat: 'soma_ia', pts: 0 }
    ]
  },
  {
    text: "08) Como você vê a personalização do ensino para alunos com diferentes níveis?",
    options: [
      { text: "Impossível humanamente fazer materiais diferentes para cada um", cat: 'soma_ia', pts: 3 },
      { text: "Tento adaptar quando sobra tempo", cat: 'soma_ia', pts: 2 },
      { text: "Consigo personalizar materiais com facilidade", cat: 'soma_ia', pts: 0 }
    ]
  },
  {
    text: "09) Como você constrói as questões das suas provas?",
    options: [
      { text: "Baseio-me na Taxonomia de Bloom e alinho aos objetivos", cat: 'soma_avaliacao', pts: 0 },
      { text: "Pego questões de bancos de dados ou ENADE", cat: 'soma_avaliacao', pts: 2 },
      { text: "Crio intuitivamente baseando no que lembro ter falado", cat: 'soma_avaliacao', pts: 3 }
    ]
  },
  {
    text: "10) Seus alunos costumam questionar a clareza dos enunciados ou os critérios de correção?",
    options: [
      { text: "Frequentemente há dúvidas sobre o que foi pedido", cat: 'soma_avaliacao', pts: 3 },
      { text: "Raramente, mas acontece", cat: 'soma_avaliacao', pts: 1 },
      { text: "Nunca, uso rubricas claras e validadas", cat: 'soma_avaliacao', pts: 0 }
    ]
  },
  {
    text: "11) Você sabe diferenciar tecnicamente uma avaliação diagnóstica, formativa e somativa?",
    options: [
      { text: "Na teoria sim, mas na prática tudo vira nota", cat: 'soma_avaliacao', pts: 3 },
      { text: "Não sei a diferença técnica", cat: 'soma_avaliacao', pts: 3 },
      { text: "Uso as três de forma estratégica", cat: 'soma_avaliacao', pts: 0 }
    ]
  },
  {
    text: "12) Como é o feedback das avaliações para os seus alunos?",
    options: [
      { text: "Apenas entrego a nota e o gabarito", cat: 'soma_avaliacao', pts: 3 },
      { text: "Comento os erros principais coletivamente", cat: 'soma_avaliacao', pts: 1 },
      { text: "Dou feedback individualizado focado na melhoria", cat: 'soma_avaliacao', pts: 0 }
    ]
  },
  {
    text: "13) Como você avalia a estética e a qualidade visual dos seus slides e materiais?",
    options: [
      { text: "Básicos. Muito texto e fundo branco", cat: 'soma_digital', pts: 3 },
      { text: "Bons, mas gasto horas para deixá-los bonitos", cat: 'soma_digital', pts: 2 },
      { text: "Profissionais, visuais e impactantes", cat: 'soma_digital', pts: 0 }
    ]
  },
  {
    text: "14) Se precisasse gravar uma videoaula de 5 minutos hoje, você:",
    options: [
      { text: "Entraria em pânico. Não sei editar nem gravar", cat: 'soma_digital', pts: 3 },
      { text: "Gravaria, mas o áudio e luz não ficariam bons", cat: 'soma_digital', pts: 2 },
      { text: "Faria tranquilamente com boa qualidade técnica", cat: 'soma_digital', pts: 0 }
    ]
  },
  {
    text: "15) Você utiliza o Ambiente Virtual como extensão da sala de aula?",
    options: [
      { text: "Apenas como repositório de PDFs", cat: 'soma_digital', pts: 3 },
      { text: "Uso fóruns e algumas ferramentas básicas", cat: 'soma_digital', pts: 1 },
      { text: "Crio trilhas de aprendizagem, vídeos e interações", cat: 'soma_digital', pts: 0 }
    ]
  },
  {
    text: "16) Você lecionará disciplinas no modelo Semipresencial ou EAD em 2026?",
    options: [
      { text: "Sim, estarei nessa modalidade", cat: 'soma_digital', pts: 100 },
      { text: "Talvez / Não sei ainda", cat: 'soma_digital', pts: 3 },
      { text: "Não, apenas presencial", cat: 'soma_digital', pts: 0 }
    ]
  }
];

// --- CAMADA DE DADOS ---
const DataService = {
  login: async (email, password) => {
    if (USE_REAL_FIREBASE && dbReal) {
      const q = query(collection(dbReal, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) throw new Error("Usuário não encontrado.");
      const userData = querySnapshot.docs[0].data();
      if (userData.password !== password) throw new Error("Senha incorreta.");
      return { ...userData, id: querySnapshot.docs[0].id };
    }
  },
  register: async (userData) => {
    const newId = Date.now().toString();
    const userToSave = { ...userData, id: newId };
    
    // VALIDACAO CRITICA DE BANCO
    if (!dbReal) {
        throw new Error("Erro Crítico: Banco de dados não conectado. Verifique se as chaves da API estão corretas e se você tem internet.");
    }

    if (USE_REAL_FIREBASE && dbReal) {
      const q = query(collection(dbReal, "users"), where("email", "==", userData.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) throw new Error("Email já cadastrado.");
      await setDoc(doc(dbReal, "users", newId), userToSave);
      return userToSave;
    }
    // Fallback se algo muito estranho acontecer
    throw new Error("Erro desconhecido ao tentar registrar.");
  },
  updateUser: async (userId, updates) => {
    if (USE_REAL_FIREBASE && dbReal) {
      const userRef = doc(dbReal, "users", userId);
      await updateDoc(userRef, updates);
      const snap = await getDoc(userRef);
      return { ...snap.data(), id: userId };
    }
  },
  deleteUser: async (userId) => {
    if (USE_REAL_FIREBASE && dbReal) {
      await deleteDoc(doc(dbReal, "users", userId));
    }
  },
  getSessionUser: async (sessionId) => {
    if (USE_REAL_FIREBASE && dbReal) {
      try {
        const docRef = doc(dbReal, "users", sessionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return { ...docSnap.data(), id: sessionId };
      } catch (e) { return null; }
    }
    return null;
  },
  getAllUsers: async () => {
    if (USE_REAL_FIREBASE && dbReal) {
      const querySnapshot = await getDocs(collection(dbReal, "users"));
      return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    }
    return [];
  }
};

const TIMELINES = {
  graduacao: [
    { date: '26/01/2026 (Segunda-Feira) - 19h00', title: 'Abertura e Palestra', desc: 'Abertura do evento, Recepção institucional, Palestra: Futurismo & Megatendências', location: 'Anfiteatro Eco Campus', type: 'presencial' },
    { date: '27/01/2026 (Terça-Feira)', title: 'Momento Assíncrono', desc: 'O professor terá esse momento para fazer a parte assíncrona da sua trilha de formação.', type: 'assincrono' },
    { date: '28/01/2026 (Quarta-Feira) - 19h00', title: 'Momento Síncrono', desc: 'Encontro ao vivo com palestrante via Google Meet.', type: 'sincrono' },
    { date: '29/01/2026 (Quinta-Feira) - 19h00', title: 'Workshop Presencial', desc: 'Aplicação prática da trilha.', location: 'Eco Campus', type: 'presencial' },
    { date: '30/01/2026 (Sexta-Feira)', title: 'Elaboração do Planejamento Educacional Docente (PED)', desc: 'Início da elaboração do PED.', type: 'pratica' },
    { date: '02/02/2026 (Segunda-Feira) - 19h15', title: 'Reunião Geral de Professores', desc: 'Lançamento da segunda turma do peer, informações sobre provas, informações sobre planejamento educacional. Reunião inicia as 19h00.', location: 'Anfiteatro Eco Campus', type: 'reuniao' },
    { date: '03/02/2026 (Terça-Feira) - 19h30', title: 'Experiência Integrado', desc: 'Capacitação da área das experiências Integrado.', location: 'Anfiteatro Eco Campus', type: 'evento' },
    { date: '03/02/2026 (Terça-Feira) - 14h00', title: 'Capacitação para entrevistas em mídias', desc: 'Treinamento com área de comunicação.', location: 'Anfiteatro do Centro', type: 'treinamento' },
  ],
  colegio: [
    { date: '26/01/2026 (Segunda-Feira) - 19h00', title: 'Abertura e Palestra', desc: 'Abertura do evento, Recepção institucional, Palestra: Futurismo & Megatendências', location: 'Anfiteatro Eco Campus', type: 'presencial' },
    { date: '27/01/2026 (Terça-Feira) - 09h00', title: 'Reunião de Planejamento', desc: 'Reunião de alinhamento e planejamento com as coordenações.', location: 'Anfiteatro Eco Campus', type: 'reuniao' },
    { date: '27/01/2026 (Terça-Feira) - 14h00', title: 'Capacitação Pense+', desc: 'Capacitação específica.', location: 'Sala D4 Eco Campus', type: 'treinamento' },
    { date: '27/01/2026 (Terça-Feira) - 14h00', title: 'Capacitação Bilíngue', desc: 'Capacitação para professores do Programa Bilingue.', location: 'Sala D7 Eco Campus', type: 'treinamento' },
    { date: '27/01/2026 (Terça-Feira)', title: 'Momento Assíncrono', desc: 'O professor terá esse momento para fazer a parte assíncrona da sua trilha de formação.', type: 'assincrono' },
    { date: '28/01/2026 (Quarta-Feira) - 09h00', title: 'Capacitação Poliedro', desc: 'Treinamento sistema Poliedro.', type: 'treinamento' },
    { date: '28/01/2026 (Quarta-Feira) - 19h00', title: 'Momento Síncrono', desc: 'Encontro ao vivo com palestrante via Google Meet.', type: 'sincrono' },
    { date: '29/01/2026 (Quinta-Feira) - 09h00', title: 'Neurodivergentes: Compreendendo e Incluindo no Contexto Escolar', desc: 'Conscientização, estratégias de sala de aula e identificação de sinais. (Para professores)', type: 'presencial' },
    { date: '29/01/2026 (Quinta-Feira) - 19h00', title: 'Workshop Presencial', desc: 'Aplicação prática da trilha.', location: 'Eco Campus', type: 'presencial' },
    { date: '30/01/2026 (Sexta-Feira)', title: 'Elaboração do Planejamento Educacional Docente (PED)', desc: 'Início da elaboração do PED.', type: 'pratica' },
    { date: '03/02/2026 (Terça-Feira) - 19h30', title: 'Experiência Integrado', desc: 'Capacitação da área das experiências Integrado.', location: 'Anfiteatro Eco Campus', type: 'evento' },
    { date: '03/02/2026 (Terça-Feira) - 14h00', title: 'Capacitação para entrevistas em mídias', desc: 'Treinamento com área de comunicação.', location: 'Anfiteatro Campus', type: 'treinamento' },
  ],
  medicina_cm: [
    { date: '26/01/2026 (Segunda-Feira) - 19h00', title: 'Abertura e Palestra', desc: 'Abertura do evento, Recepção institucional, Palestra: Futurismo & Megatendências', location: 'Anfiteatro Eco Campus', type: 'presencial' },
    { date: '27/01/2026 (Terça-Feira)', title: 'Momento Assíncrono', desc: 'O professor terá esse momento para fazer a parte assíncrona da sua trilha de formação.', type: 'assincrono' },
    { date: '27/01/2026 (Terça-Feira) - 19h00', title: 'Reunião Geral de Professores', desc: 'Lançamento da segunda turma do peer, informações sobre provas, informações sobre planejamento educacional. Reunião inicia as 19h00.', location: 'Anfiteatro Eco Campus', type: 'reuniao' },
    { date: '28/01/2026 (Quarta-Feira) - 14h00', title: 'Troca de Experiências', desc: 'Trocas entre professores da medicina de Campo Mourão com Macapá dos professores do primeiro e segundo semestre.', location: 'Síncrono no Campus Macapá', type: 'reuniao' },
    { date: '28/01/2026 (Quarta-Feira) - 19h00', title: 'Momento Síncrono', desc: 'Encontro ao vivo com palestrante via Google Meet.', type: 'sincrono' },
    { date: '29/01/2026 (Quinta-Feira) - 19h00', title: 'Workshop Presencial', desc: 'Aplicação prática da trilha.', location: 'Eco Campus', type: 'presencial' },
    { date: '30/01/2026 (Sexta-Feira)', title: 'Elaboração do Planejamento Educacional Docente (PED)', desc: 'Início da elaboração do PED.', type: 'pratica' },
    { date: '31/01/2026 (Sábado) - 09h00', title: 'Reunião Geral de Professores', desc: 'Lançamento da segunda turma do peer, informações sobre provas, informações sobre planejamento educacional.', location: 'Anfiteatro Eco Campus', type: 'reuniao' },
    { date: '03/02/2026 (Terça-Feira) - 19h30', title: 'Experiência Integrado', desc: 'Capacitação da área das experiências Integrado.', location: 'Anfiteatro Eco Campus', type: 'evento' },
    { date: '03/02/2026 (Terça-Feira) - 14h00', title: 'Capacitação para entrevistas em mídias', desc: 'Treinamento com área de comunicação.', location: 'Anfiteatro Campus', type: 'treinamento' },
  ],
  medicina_macapa: [
    { date: '19/01/2026 (Segunda-Feira) - 18h45', title: 'Reunião Geral com Professores', desc: 'Reunião de professores com o DEA.', location: 'Síncrono', type: 'reuniao' },
    { date: '20/01/2026 (Terça-Feira) - 18h45', title: 'Rodada de Planejamento', desc: 'Rodada de Planejamento de disciplinas com professores de Macapá.', location: 'Presencial no Campus Macapá', type: 'reuniao' },
    { date: '26/01/2026 (Segunda-Feira) - 19h00', title: 'Abertura e Palestra', desc: 'Abertura do evento, Recepção institucional, Palestra: Futurismo & Megatendências', location: 'Presencial no Campus Macapá', type: 'presencial' },
    { date: '27/01/2026 (Terça-Feira)', title: 'Momento Assíncrono', desc: 'O professor terá esse momento para fazer a parte assíncrona da sua trilha de formação.', type: 'assincrono' },
    { date: '28/01/2026 (Quarta-Feira) - 14h00', title: 'Troca de Experiências', desc: 'Trocas entre professores da medicina de Campo Mourão com Macapá dos professores do primeiro e segundo semestre.', location: 'Síncrono no Campus Macapá', type: 'reuniao' },
    { date: '28/01/2026 (Quarta-Feira) - 19h00', title: 'Momento Síncrono', desc: 'Encontro ao vivo com palestrante via Google Meet.', type: 'sincrono' },
    { date: '30/01/2026 (Sexta-Feira)', title: 'Elaboração do Planejamento Educacional Docente (PED)', desc: 'Início da elaboração do PED.', type: 'pratica' },
  ]
};

// --- APP ---

export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [timelineTab, setTimelineTab] = useState('graduacao');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const init = async () => {
      const savedId = localStorage.getItem('CAFE_SESSION_ID');
      if (savedId) {
        setLoading(true);
        const u = await DataService.getSessionUser(savedId);
        if (u) { setUser(u); setView(u.test_completed ? 'dashboard' : 'test'); }
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleImpersonate = (targetUser) => {
    setUser(targetUser);
    localStorage.setItem('CAFE_SESSION_ID', targetUser.id);
    setView(targetUser.test_completed ? 'dashboard' : 'test');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (e.target.email.value === 'admin' && e.target.password.value === 'admin') {
      setView('admin'); return;
    }
    setLoading(true);
    try {
      const u = await DataService.login(e.target.email.value, e.target.password.value);
      setUser(u); localStorage.setItem('CAFE_SESSION_ID', u.id);
      setView(u.test_completed ? 'dashboard' : 'test');
    } catch(err) { alert(err.message); }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      colegiado: e.target.colegiado.value,
      unidade: e.target.unidade.value,
      semipresencial: false, 
      test_completed: false,
      track: null,
      attendance: {},
      watched_classes: [],
      ped_submitted: false,
      ped_url: '',
      evaluation_submitted: false,
      evaluation_data: null,
      created_at: new Date().toISOString()
    };

    // REGRA DE BYPASS PARA MEDICINA MACAPÁ
    // Ajuste: A string no select agora é "Macapá" com acento
    if (formData.unidade === 'Macapá' && formData.colegiado === 'Medicina') {
      formData.track = TRACKS['MA'].name;
      formData.track_code = 'MA';
      formData.test_completed = true;
    }

    try {
      const u = await DataService.register(formData);
      setUser(u); localStorage.setItem('CAFE_SESSION_ID', u.id);
      setView(u.test_completed ? 'dashboard' : 'test');
    } catch(err) { alert(err.message); }
    setLoading(false);
  };

  const updateUser = async (updates) => {
    setUser(prev => ({...prev, ...updates}));
    await DataService.updateUser(user.id, updates);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48}/></div>;

  if (view === 'certificate') return <CertificateView user={user} onBack={() => setView('dashboard')} />;
  if (view === 'admin') return <AdminPanel onBack={() => setView('landing')} onImpersonate={handleImpersonate} />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-blue-100">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-8 h-8 bg-blue-700 rounded text-white font-bold flex items-center justify-center">I</div>
            <span className="font-bold text-xl text-blue-900">CAFE 2026</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden md:block text-sm font-medium text-gray-600">{user.name.split(' ')[0]}</span>
                <button onClick={() => setView('dashboard')} className="text-blue-600 font-medium text-sm">Minha Área</button>
                <button onClick={() => { setUser(null); localStorage.removeItem('CAFE_SESSION_ID'); setView('landing'); }} className="text-red-500"><LogOut size={18}/></button>
              </>
            ) : <button onClick={() => setView('auth')} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">Área do Professor</button>}
          </div>
        </div>
      </nav>

      <main className="fade-in">
        {view === 'landing' && (
          <>
            <div className="bg-blue-900 text-white py-20 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center" />
              <div className="relative max-w-4xl mx-auto px-4">
                <span className="bg-blue-800 px-3 py-1 rounded-full text-xs font-bold tracking-widest">IX C.A.F.E.</span>
                <h1 className="text-4xl md:text-6xl font-extrabold my-6">Congresso de Aprendizagem e<br/>Formação Educacional 2026</h1>
                
                <button onClick={() => setView('auth')} className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:translate-y-[-2px] transition">Inscreva-se Agora</button>
              </div>
            </div>
            <div className="py-16 bg-white text-center">
              <div className="max-w-4xl mx-auto px-4 font-serif italic text-gray-700">
                <div className="mb-12">
                  <h3 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">Nosso sonho grande</h3>
                  <p className="text-lg md:text-2xl text-gray-600 leading-relaxed">
                    "Em cada cidade onde o integrado estiver presente, nosso ecossistema de ensino, saúde e extensão será reconhecido como a principal referência em qualidade e acessibilidade."
                  </p>
                </div>
                <div>
                  <h3 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">Missão do C.A.F.E.</h3>
                  <p className="text-2xl md:text-4xl text-gray-800 font-bold leading-relaxed">
                    "Fazer com que o professor se sinta protagonista desse projeto e ajude o estudante a construir sua biografia."
                  </p>
                </div>
              </div>
            </div>
            <div className="py-16 max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Programação Oficial</h2>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {Object.keys(TIMELINES).map(k => (
                  <button key={k} onClick={() => setTimelineTab(k)} className={`px-4 py-2 rounded-full text-sm font-bold transition ${timelineTab === k ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
                    {k.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                {TIMELINES[timelineTab].map((item, idx) => (
                  <div key={idx} className="relative pl-8 pb-8 last:pb-0 border-l-2 border-blue-100">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${item.type === 'presencial' ? 'bg-blue-600' : (item.type === 'reuniao' ? 'bg-yellow-500' : 'bg-purple-500')}`} />
                    <span className="text-xs font-bold text-blue-600 block mb-1">{item.date}</span>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-1">{item.desc}</p>
                    {item.location && (
                      <div className="flex items-center text-xs font-semibold text-gray-500 mt-2 bg-gray-50 p-2 rounded w-fit">
                        <MapPin size={14} className="mr-1 text-gray-400"/> {item.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === 'auth' && (
          <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
              <h2 className="text-2xl font-bold text-center mb-6">Acesso ao CAFE 2026</h2>
              <form onSubmit={handleLogin} className="space-y-4 mb-8">
                <div className="text-xs font-bold text-gray-400 border-b pb-2">JÁ TENHO CONTA</div>
                <input name="email" type="text" placeholder="Email" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <input name="password" type="password" placeholder="Senha" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Entrar</button>
              </form>
              <form onSubmit={handleRegister} className="space-y-4 pt-4 border-t">
                <div className="text-xs font-bold text-gray-400 pb-2">PRIMEIRO ACESSO</div>
                <input name="name" type="text" placeholder="Nome Completo" required className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                <input name="email" type="email" placeholder="Email Institucional" required className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                <div className="grid grid-cols-2 gap-4">
                  <select name="colegiado" required className="px-4 py-3 border rounded-lg bg-white text-sm">
                    <option value="">Área</option>
                    {AREA_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select name="unidade" required className="px-4 py-3 border rounded-lg bg-white text-sm">
                    <option value="">Unidade</option>
                    {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <input name="password" type="password" placeholder="Crie uma Senha" required className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                <button className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">Cadastrar e Iniciar</button>
              </form>
            </div>
          </div>
        )}

        {view === 'test' && <LevelingTest user={user} onComplete={updateUser} onFinish={() => setView('dashboard')} />}
        {view === 'dashboard' && user && <Dashboard user={user} onUpdate={updateUser} onCertificate={() => setView('certificate')} />}
      </main>
    </div>
  );
}

function LevelingTest({ user, onComplete, onFinish }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ 'soma_metodologia': 0, 'soma_ia': 0, 'soma_avaliacao': 0, 'soma_digital': 0 });
  const [calculating, setCalculating] = useState(false);
  const [recommended, setRecommended] = useState(null);

  const handleAnswer = (cat, pts) => {
    const newScores = { ...scores, [cat]: scores[cat] + pts };
    setScores(newScores);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult(newScores);
    }
  };

  const calculateResult = (finalScores) => {
    setCalculating(true);
    const winnerCat = Object.keys(finalScores).reduce((a, b) => finalScores[a] > finalScores[b] ? a : b);
    const trackId = CATEGORY_MAP[winnerCat];
    
    setTimeout(() => {
      setRecommended(trackId);
      setCalculating(false);
    }, 1500);
  };

  const confirmTrack = (trackId) => {
    onComplete({ track: TRACKS[trackId].name, track_code: trackId, test_completed: true });
    onFinish();
  };

  if (calculating) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={64} />
        <h2 className="text-xl font-bold text-gray-700">Analisando seu perfil pedagógico...</h2>
        <p className="text-gray-500 mt-2">Identificando a melhor trilha para sua evolução.</p>
      </div>
    );
  }

  if (recommended) {
    const recTrack = TRACKS[recommended];
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle size={48} className="text-green-600"/>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Diagnóstico Concluído!</h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">Com base nas suas respostas, identificamos que a trilha abaixo trará maior impacto para sua atuação em 2026:</p>
          
          <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-8 mb-10 transform transition hover:scale-105 duration-300">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Recomendação do Sistema</h3>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-3">{recTrack.name}</h1>
            <p className="text-blue-600">{recTrack.desc}</p>
            <button 
              onClick={() => confirmTrack(recommended)}
              className="mt-6 bg-blue-600 text-white px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-blue-700 w-full md:w-auto"
            >
              Aceitar e Seguir Esta Trilha
            </button>
          </div>

          <div className="border-t pt-8">
            <p className="text-sm font-bold text-gray-500 uppercase mb-4">Ou escolha manualmente outra opção:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(TRACKS).filter(t => t.id !== recommended).map(track => (
                <button 
                  key={track.id}
                  onClick={() => confirmTrack(track.id)}
                  className="border p-4 rounded-lg hover:bg-gray-50 text-left group transition"
                >
                  <span className="block font-bold text-gray-800 group-hover:text-blue-600 mb-1">{track.name}</span>
                  <span className="text-xs text-gray-500">{track.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">QUESTÃO {step + 1}/{QUESTIONS.length}</span>
          <div className="w-32 bg-gray-100 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}></div>
          </div>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-6">{q.text}</h2>
        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <button key={idx} onClick={() => handleAnswer(opt.cat, opt.pts)} className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition">
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, onUpdate, onCertificate }) {
  const ATTENDANCE_DATES = ['26/01', '28/01', '29/01'];
  
  // Timer & Track State
  const [trackStarted, setTrackStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [contentChecked, setContentChecked] = useState(false);
  
  // Evaluation State
  const [evalForm, setEvalForm] = useState({
    nps: 10, // 0-10
    day_26: 5, // 1-5
    day_27: 5,
    day_28: 5,
    day_29: 5,
    comments: ''
  });
  
  // Modal State
  const [attendanceModal, setAttendanceModal] = useState({ isOpen: false, date: null });
  const [passwordInput, setPasswordInput] = useState('');

  // TIMER LOGIC
  useEffect(() => {
    let interval = null;
    if (trackStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [trackStarted, timeLeft]);

  // Format Time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const openAttendanceModal = (date) => {
    setAttendanceModal({ isOpen: true, date });
    setPasswordInput('');
  };

  const closeAttendanceModal = () => {
    setAttendanceModal({ isOpen: false, date: null });
    setPasswordInput('');
  };

  const confirmAttendance = () => {
    const { date } = attendanceModal;
    if (!date) return;
    
    const input = passwordInput.trim().toLowerCase();
    const correctPassword = ATTENDANCE_PASSWORDS[date].toLowerCase();

    if (input === correctPassword) {
      onUpdate({ attendance: { ...user.attendance, [date]: true } });
      alert("Presença Registrada com Sucesso!");
      closeAttendanceModal();
    } else {
      alert("Senha incorreta. Tente novamente.");
    }
  };

  const finishTrack = () => {
    if (timeLeft > 0) return alert("Aguarde o tempo mínimo de visualização.");
    if (!contentChecked) return alert("Confirme que você consumiu o conteúdo.");
    
    // Marcar track como concluída. Usamos um array mas como é só uma agora, basta checar length > 0
    onUpdate({ watched_classes: ['completed'] });
    alert("Parabéns! Trilha concluída com sucesso.");
  };

  const submitPED = () => {
    const url = document.getElementById('ped-url').value;
    if (!url.includes('http')) return alert("Por favor, insira um link válido (começando com http/https).");
    onUpdate({ ped_submitted: true, ped_url: url });
    alert("PED enviado! Certifique-se que o link é público.");
  };

  const submitEval = () => {
    if (evalForm.comments.length < 5) return alert("Por favor, deixe um comentário ou sugestão.");
    onUpdate({ 
      evaluation_submitted: true, 
      evaluation_data: evalForm 
    });
    alert("Avaliação enviada. Certificado desbloqueado!");
  };

  const hasAttendance = ATTENDANCE_DATES.every(d => user.attendance?.[d]);
  const hasContent = (user.watched_classes || []).length > 0; 
  const hasPED = user.ped_submitted;
  const hasEval = user.evaluation_submitted;
  const canCertify = hasAttendance && hasContent && hasPED && hasEval;

  // GET CURRENT TRACK DATA
  // Fallback safe: if track_code missing, use 'MA' or find by name
  const currentTrackCode = user.track_code || Object.keys(TRACKS).find(k => TRACKS[k].name === user.track) || 'MA';
  const activeTrack = TRACKS[currentTrackCode];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 relative">
      <div className="bg-white rounded-xl shadow p-6 mb-8 border-l-4 border-blue-600 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Painel do Professor</h1>
          <p className="text-gray-600">Trilha Ativa: <span className="font-bold text-blue-700">{activeTrack.name}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          {/* PRESENÇA */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><CalendarCheck className="text-blue-500"/> Presença (Senha)</h3>
            <div className="space-y-3">
              {ATTENDANCE_DATES.map(date => (
                <div key={date} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">{date}</span>
                  {user.attendance?.[date] ? (
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">OK</span>
                  ) : (
                    <button onClick={() => openAttendanceModal(date)} className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">REGISTRAR</button>
                  )}
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-2">* 27/01 validado por atividade.</p>
            </div>
          </div>

          {/* AVALIAÇÃO REFORMULADA */}
          <div className={`bg-white p-6 rounded-xl shadow-sm ${!hasPED ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Star className="text-yellow-500"/> Avalie sua experiência no IX C.A.F.E.</h3>
            {user.evaluation_submitted ? (
              <div className="text-green-600 font-bold text-center py-4 bg-green-50 rounded">Avaliação Enviada. Obrigado!</div>
            ) : (
              <div className="space-y-4">
                
                {/* NPS Geral */}
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">De 0 a 10, o quanto você recomenda o evento?</label>
                  <div className="flex justify-between text-xs text-gray-400 mb-1"><span>0 (Jamais)</span><span>10 (Com certeza)</span></div>
                  <input 
                    type="range" min="0" max="10" 
                    value={evalForm.nps} 
                    onChange={e => setEvalForm({...evalForm, nps: parseInt(e.target.value)})} 
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="text-center font-bold text-blue-600">{evalForm.nps}</div>
                </div>

                <div className="border-t pt-2"></div>

                {/* Notas por Dia */}
                <p className="text-xs font-bold text-gray-500 uppercase">Avalie cada dia (1 a 5):</p>
                {EVENT_DAYS.map(day => (
                  <div key={day.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 text-xs w-1/2">{day.label}</span>
                    <input 
                      type="number" min="1" max="5" 
                      value={evalForm[day.id]} 
                      onChange={e => setEvalForm({...evalForm, [day.id]: parseInt(e.target.value)})}
                      className="w-16 border rounded p-1 text-center font-bold"
                    />
                  </div>
                ))}

                <textarea 
                  className="w-full border rounded p-2 text-sm h-20" 
                  placeholder="Deixe suas sugestões e elogios..." 
                  value={evalForm.comments} 
                  onChange={e => setEvalForm({...evalForm, comments: e.target.value})}
                ></textarea>
                
                <button onClick={submitEval} className="w-full bg-blue-600 text-white text-sm py-2 rounded font-bold hover:bg-blue-700 transition">Enviar Avaliação</button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* CARD NOVO: ENCONTRO SÍNCRONO 28/01 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Video className="text-purple-600"/> Momento Síncrono (28/01)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Participe do encontro ao vivo com o especialista da sua trilha.
            </p>
            <a 
              href={activeTrack.meetUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition transform hover:scale-105 shadow-md"
            >
              <Video className="mr-2" size={20}/>
              Acessar Sala do Meet
            </a>
          </div>

          {/* CONTEÚDO (CANVA INTEGRATION) */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BookOpen className="text-blue-500"/> Conteúdo da Trilha (Assíncrono)</h3>
            
            {hasContent && (
               <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                 <CheckCircle size={24} className="text-green-600 flex-shrink-0"/>
                 <div>
                    <h3 className="font-bold text-green-800">Trilha Concluída!</h3>
                    <p className="text-xs text-green-700">Você já finalizou esta etapa, mas pode rever o conteúdo abaixo à vontade.</p>
                 </div>
               </div>
            )}

            <div className="relative">
              {/* TRAVA INICIAL - Mostra APENAS se não começou E se não tiver concluído */}
              {!trackStarted && !hasContent && (
                <div className="absolute inset-0 z-10 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center rounded-xl p-6 text-center">
                  <Brain size={48} className="text-white mb-4"/>
                  <h2 className="text-2xl font-bold text-white mb-2">{activeTrack.name}</h2>
                  <p className="text-gray-300 mb-6 max-w-md">Para validar sua presença assíncrona (27/01), você deve consumir este conteúdo por no mínimo 5 minutos.</p>
                  <button 
                    onClick={() => setTrackStarted(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition transform hover:scale-105"
                  >
                    <PlayCircle size={24}/> Iniciar Estudos
                  </button>
                </div>
              )}

              {/* IFRAME CANVA - Sempre renderizado agora */}
              <div style={{
                position: 'relative', 
                width: '100%', 
                height: 0, 
                paddingTop: '56.25%', 
                paddingBottom: 0, 
                boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)', 
                marginTop: '1.6em', 
                marginBottom: '0.9em', 
                overflow: 'hidden', 
                borderRadius: '8px', 
                willChange: 'transform'
              }}>
                <iframe 
                  loading="lazy" 
                  style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0}}
                  src={activeTrack.embedUrl} 
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <a href={activeTrack.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600">
                    <ExternalLink size={14}/> Abrir no Canva
                  </a>
                  <span>Autor: {activeTrack.author}</span>
              </div>

              {/* AREA DE VALIDAÇÃO (TIMER) - Mostra APENAS se começou E ainda não concluiu */}
              {trackStarted && !hasContent && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    {/* TIMER */}
                    <div className="flex items-center gap-2">
                      <Clock size={20} className={timeLeft > 0 ? "text-blue-600 animate-pulse" : "text-green-600"}/>
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase block">Tempo Restante</span>
                        <span className={`font-mono text-xl font-bold ${timeLeft > 0 ? 'text-blue-900' : 'text-green-600'}`}>
                          {timeLeft > 0 ? "Contabilizando..." : "Concluído"}
                        </span>
                      </div>
                    </div>

                    {/* AÇÕES */}
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      <label className={`flex items-center p-2 rounded cursor-pointer transition ${timeLeft > 0 ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-100'}`}>
                        <input 
                          type="checkbox" 
                          checked={contentChecked} 
                          onChange={(e) => setContentChecked(e.target.checked)}
                          disabled={timeLeft > 0}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          Declaro que assisti e compreendi o conteúdo da trilha.
                        </span>
                      </label>
                      
                      <button 
                        onClick={finishTrack}
                        disabled={timeLeft > 0 || !contentChecked}
                        className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-300 disabled:text-gray-500 hover:bg-green-700 transition"
                      >
                        Concluir Módulo
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PED */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FileText className="text-blue-500"/> Entrega do PED</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm text-blue-800 border-l-4 border-blue-500">
              <p className="font-bold mb-1">Atenção:</p>
              Compartilhe o LINK da sua planilha Google. 
              <br/><strong>Importante:</strong> Libere o acesso como "Leitor" para <i>qualquer pessoa com o link</i>.
            </div>
            {user.ped_submitted ? (
              <div className="bg-gray-100 p-4 rounded text-gray-600 break-all">
                <a href={user.ped_url} target="_blank" className="text-blue-600 underline text-sm">{user.ped_url}</a>
                <div className="mt-2 text-xs font-bold text-green-600">PED ENVIADO</div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input id="ped-url" type="url" className="flex-1 border p-3 rounded-lg outline-none" placeholder="https://docs.google.com/spreadsheets/..." />
                <button onClick={submitPED} className="bg-gray-800 text-white px-6 rounded-lg font-bold hover:bg-gray-900">Enviar</button>
              </div>
            )}
          </div>

          {/* CERTIFICADO */}
          <div className="bg-white p-8 rounded-xl shadow-sm text-center border-2 border-dashed border-gray-200">
            {!canCertify ? (
              <div className="py-4 opacity-50">
                <Lock size={48} className="mx-auto mb-3"/>
                <h3 className="font-bold">Certificado Bloqueado</h3>
                <p className="text-sm">Complete Presença, Conteúdo, PED e Avaliação.</p>
              </div>
            ) : (
              <div className="py-4">
                <Award size={64} className="mx-auto text-yellow-500 mb-4 animate-bounce"/>
                <h3 className="text-2xl font-bold">Parabéns, Professor!</h3>
                <button onClick={onCertificate} className="mt-4 bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition">Emitir Certificado</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ATTENDANCE MODAL */}
      {attendanceModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scale-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Registrar Presença</h3>
              <button onClick={closeAttendanceModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">
              Digite a palavra-chave informada no evento para o dia <span className="font-bold text-blue-600">{attendanceModal.date}</span>:
            </p>
            
            <input 
              type="text" 
              className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg mb-6 focus:border-blue-500 focus:ring-0 outline-none transition text-center uppercase font-bold text-gray-700 tracking-wider"
              placeholder="PALAVRA-CHAVE"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
            />
            
            <div className="flex gap-3">
              <button onClick={closeAttendanceModal} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition">
                Cancelar
              </button>
              <button onClick={confirmAttendance} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg transition transform hover:-translate-y-0.5">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CertificateView({ user, onBack }) {
  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="no-print flex gap-4 mb-6">
        <button onClick={onBack} className="bg-gray-600 text-white px-6 py-2 rounded font-bold hover:bg-gray-500 transition">Voltar</button>
      </div>
      <div id="certificate-print" className="bg-white w-[297mm] h-[210mm] p-12 relative shadow-2xl flex flex-col items-center text-center">
        {/* Borda Decorativa */}
        <div className="absolute inset-5 border-4 border-double border-blue-900 pointer-events-none"></div>
        
        <div className="mt-12 mb-8 text-4xl font-serif font-bold text-blue-900 uppercase">Grupo Integrado</div>
        <h1 className="text-6xl font-serif font-bold text-gray-800 mb-4">CERTIFICADO</h1>
        <p className="text-xl text-gray-500 uppercase tracking-[0.3em] mb-12">De Participação</p>
        
        <div className="text-2xl leading-loose max-w-5xl text-gray-700 font-serif">
          Certificamos que
          <div className="text-4xl font-bold text-gray-900 my-2 border-b-2 border-gray-300 inline-block px-12 pb-2 mx-4">{user.name}</div>
          <br/>
          participou com êxito do
          <br/>
          <strong className="text-blue-800">IX Congresso de Aprendizagem e Formação Educacional (CAFE 2026)</strong>,
          <br/>
          com foco na trilha de <strong className="text-blue-800">{user.track}</strong>, totalizando a carga horária de <strong>20 horas</strong>.
        </div>

        <div className="mt-auto mb-16 flex justify-between w-full max-w-4xl px-16">
          <div className="text-center">
            <div className="font-bold text-lg">Campo Mourão, PR</div>
            <div className="text-gray-600">03 de Fevereiro de 2026</div>
          </div>
          <div className="text-center w-64 flex flex-col items-center">
             {/* ASSINATURA EM TEXTO (CURSIVA) */}
             <div style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '3rem', color: '#1e3a8a', fontStyle: 'italic', lineHeight: '1' }}>
                Rafael Zampar
             </div>
             <div className="border-t border-gray-400 pt-2 w-full mt-2">
                <p className="font-bold text-gray-900">Prof. Rafael Zampar</p>
                <p className="text-sm text-gray-500">Diretor de Ensino</p>
             </div>
          </div>
        </div>
      </div>
      <style>{`
        @media print { 
          body * { visibility: hidden; } 
          #certificate-print, #certificate-print * { visibility: visible; } 
          #certificate-print { position: fixed; left: 0; top: 0; width: 100%; height: 100%; margin: 0; padding: 0; } 
          .no-print { display: none; } 
          @page { margin: 0; size: landscape; }
        }
      `}</style>
    </div>
  );
}

// --- ADMIN REFORMULADO (V5 - COM FILTROS DE VERDADE E AVALIAÇÃO DETALHADA) ---

function AdminPanel({ onBack, onImpersonate }) {
  const [users, setUsers] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState('');
  
  // States para Modais
  const [modal, setModal] = useState({ type: null, user: null, value: '' });

  // FILTERS
  const [filterUnit, setFilterUnit] = useState('Todas');
  const [filterColegiado, setFilterColegiado] = useState('Todos');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const list = await DataService.getAllUsers();
    setUsers(list);
  };

    // FILTER LOGIC
    const filteredUsers = users.filter(u => {
      const matchesSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
                            (u.email || '').toLowerCase().includes(search.toLowerCase());
      const matchesUnit = filterUnit === 'Todas' || u.unidade === filterUnit;
      const matchesColegiado = filterColegiado === 'Todos' || u.colegiado === filterColegiado;
      return matchesSearch && matchesUnit && matchesColegiado;
    });

  const confirmAction = async () => {
    const { type, user, value } = modal;
    if (!user) return;

    try {
      if (type === 'delete') {
        await DataService.deleteUser(user.id);
        setUsers(users.filter(u => u.id !== user.id));
        alert("Usuário removido.");
      } 
      else if (type === 'password') {
        if (!value) return alert("Digite a nova senha.");
        await DataService.updateUser(user.id, { password: value });
        alert("Senha atualizada.");
      } 
      else if (type === 'impersonate') {
        onImpersonate(user);
        return; // Não fecha o modal, pois o app muda de tela
      }
      setModal({ type: null, user: null, value: '' });
    } catch (error) {
      alert("Erro na operação: " + error.message);
    }
  };

  const downloadCSV = () => {
    // 1. Adicionar BOM para Excel (\uFEFF)
    // 2. Usar Ponto e Vírgula (;) como separador
    let csv = "\uFEFFNome;Email;Unidade;Colegiado;Trilha;PED Link;NPS (Geral);Nota 26;Nota 27;Nota 28;Nota 29;Comentarios\n";
    
    users.forEach(u => {
      const e = u.evaluation_data || {};
      const line = [
        `"${u.name || ''}"`,
        u.email || '',
        u.unidade || '',
        u.colegiado || '',
        u.track || 'N/A',
        u.ped_url || 'Pendente',
        e.nps || '-',
        e.day_26 || '-',
        e.day_27 || '-',
        e.day_28 || '-',
        e.day_29 || '-',
        `"${(e.comments || '').replace(/\n/g, ' ').replace(/"/g, '""')}"` // Escape quotes
      ].join(';'); // Separador ;
      csv += line + "\n";
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cafe_relatorio_completo.csv";
    link.click();
  };

  const stats = useMemo(() => {
    const total = filteredUsers.length;
    const pedSubmitted = filteredUsers.filter(u => u.ped_submitted).length;
    
    // Calculo de médias de avaliação
    let sumNPS = 0, sum26 = 0, sum27 = 0, sum28 = 0, sum29 = 0;
    let countEval = 0;

    filteredUsers.forEach(u => {
      if (u.evaluation_submitted && u.evaluation_data) {
        const e = u.evaluation_data;
        sumNPS += e.nps || 0;
        sum26 += e.day_26 || 0;
        sum27 += e.day_27 || 0;
        sum28 += e.day_28 || 0;
        sum29 += e.day_29 || 0;
        countEval++;
      }
    });

    const avg = (sum) => countEval > 0 ? (sum / countEval).toFixed(1) : '-';

    return {
      total,
      pedSubmitted,
      evalCount: countEval,
      avgNPS: avg(sumNPS),
      avg26: avg(sum26),
      avg27: avg(sum27),
      avg28: avg(sum28),
      avg29: avg(sum29),
      byTrack: filteredUsers.reduce((acc, u) => { acc[u.track || 'Sem Trilha'] = (acc[u.track || 'Sem Trilha'] || 0) + 1; return acc; }, {}),
    };
  }, [filteredUsers]);

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-100">
      
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Lock className="text-blue-900"/> Admin Console
          </h1>
          <div className="flex gap-2">
            <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded font-bold flex items-center gap-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <List size={18}/> Lista
            </button>
            <button onClick={() => setViewMode('stats')} className={`px-4 py-2 rounded font-bold flex items-center gap-2 ${viewMode === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <LayoutDashboard size={18}/> Dashboard
            </button>
            <button onClick={onBack} className="px-4 py-2 text-red-600 font-bold hover:bg-red-50 rounded ml-4">Sair</button>
          </div>
        </div>

      {/* BARRA DE FILTROS GLOBAIS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16}/>
              <input type="text" placeholder="Nome ou Email..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Unidade</label>
            <select className="w-full border rounded-lg py-2 px-3 text-sm" value={filterUnit} onChange={e => setFilterUnit(e.target.value)}>
              <option value="Todas">Todas as Unidades</option>
              <option value="CM_Centro">CM Centro</option>
              <option value="CM_Campus">CM Campus</option>
              <option value="Macapa">Macapá</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Colegiado</label>
            <select className="w-full border rounded-lg py-2 px-3 text-sm" value={filterColegiado} onChange={e => setFilterColegiado(e.target.value)}>
              <option value="Todos">Todos os Colegiados</option>
              {COLEGIADOS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={downloadCSV} className="bg-green-600 text-white py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 h-10"><Download size={16}/> Exportar CSV</button>
        </div>
      </div>

      {/* DASHBOARD VIEW */}
      {viewMode === 'stats' && (
        <div className="animate-in fade-in zoom-in duration-300">
          
          {/* TOP CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-blue-500">
              <h3 className="text-gray-500 text-xs font-bold uppercase">Inscritos (Filtrados)</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-green-500">
              <h3 className="text-gray-500 text-xs font-bold uppercase">PEDs Entregues</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.pedSubmitted}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-yellow-500">
              <h3 className="text-gray-500 text-xs font-bold uppercase">Avaliações Feitas</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.evalCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-purple-500">
              <h3 className="text-gray-500 text-xs font-bold uppercase">NPS Médio</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.avgNPS}</p>
            </div>
          </div>

          {/* EVALUATION MATRIX */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Star className="text-yellow-500"/> Avaliação por Dia (Média)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Dia 26/01</div>
                <div className="text-2xl font-bold text-gray-800">{stats.avg26}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Dia 27/01</div>
                <div className="text-2xl font-bold text-gray-800">{stats.avg27}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Dia 28/01</div>
                <div className="text-2xl font-bold text-gray-800">{stats.avg28}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Dia 29/01</div>
                <div className="text-2xl font-bold text-gray-800">{stats.avg29}</div>
              </div>
            </div>
          </div>

          {/* TRACKS DISTRIBUTION */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Distribuição por Trilha (Filtro Atual)</h3>
            <div className="space-y-3">
              {Object.entries(stats.byTrack).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="font-bold text-gray-900">{val}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(val/stats.total)*100}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Professor</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Unidade/Colegiado</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Trilha</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">{u.name?.charAt(0) || '?'}</div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{u.name}</div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{u.colegiado}</div>
                      <div className="text-xs text-gray-500">{u.unidade}</div>
                      {u.semipresencial && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">EAD/Semi</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.track ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{u.track || 'Pendente'}</span>
                      {u.ped_submitted && <div className="text-xs text-blue-600 font-bold mt-1">PED Enviado</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setModal({type:'impersonate', user:u, value:''})} title="Acessar" className="text-gray-400 hover:text-blue-600 p-1 border rounded hover:bg-white"><Eye size={18} /></button>
                        <button onClick={() => setModal({type:'password', user:u, value:''})} title="Nova Senha" className="text-gray-400 hover:text-yellow-600 p-1 border rounded hover:bg-white"><Key size={18} /></button>
                        <button onClick={() => setModal({type:'delete', user:u, value:''})} title="Apagar" className="text-gray-400 hover:text-red-600 p-1 border rounded hover:bg-white"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADMIN MODAL SYSTEM */}
      {modal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-scale-up">
            {modal.type === 'delete' && (
              <>
                <h3 className="text-xl font-bold text-red-600 flex items-center gap-2 mb-4"><AlertTriangle/> Apagar Usuário?</h3>
                <p className="text-gray-600 mb-6">Tem certeza que deseja remover <b>{modal.user.name}</b>? Essa ação é irreversível.</p>
                <div className="flex gap-3">
                  <button onClick={() => setModal({type:null})} className="flex-1 py-2 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
                  <button onClick={confirmAction} className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold">Sim, Apagar</button>
                </div>
              </>
            )}
            {modal.type === 'password' && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Redefinir Senha</h3>
                <p className="text-sm text-gray-500 mb-4">Defina uma senha temporária para <b>{modal.user.name}</b>.</p>
                <input autoFocus type="text" className="w-full border p-3 rounded mb-6 text-lg" placeholder="Nova Senha" value={modal.value} onChange={e => setModal({...modal, value: e.target.value})} />
                <div className="flex gap-3">
                  <button onClick={() => setModal({type:null})} className="flex-1 py-2 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
                  <button onClick={confirmAction} className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">Salvar Senha</button>
                </div>
              </>
            )}
            {modal.type === 'impersonate' && (
              <>
                <h3 className="text-xl font-bold text-blue-900 mb-4">Acessar Área do Professor</h3>
                <p className="text-gray-600 mb-6">Você entrará como <b>{modal.user.name}</b>. Tudo o que você fizer será salvo no perfil dele.</p>
                <div className="flex gap-3">
                  <button onClick={() => setModal({type:null})} className="flex-1 py-2 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
                  <button onClick={confirmAction} className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">Entrar Agora</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}