import { createContext, useContext, useState, useEffect } from "react";
import type { Language } from "@shared/schema";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    comments: "Comments",
    insights: "Insights",
    executiveSummary: "Executive Summary",
    settings: "Settings",
    totalComments: "Total Comments",
    positiveRate: "Positive Rate",
    viewerCuriosity: "Viewer Curiosity",
    actionableInsights: "Actionable Insights",
    sentimentDistribution: "Sentiment Distribution",
    sentimentCounts: "Sentiment Counts",
    topThemes: "Top Themes & Topics",
    commentsExplorer: "Comments Explorer",
    postId: "Post ID",
    comment: "Comment",
    tone: "Tone",
    themes: "Themes",
    questions: "Questions",
    filterBySentiment: "Filter by Sentiment",
    filterByTheme: "Filter by Theme",
    search: "Search comments...",
    all: "All",
    positive: "Positive",
    negative: "Negative",
    neutral: "Neutral",
    mixed: "Mixed",
    export: "Export",
    exportCSV: "Export CSV",
    downloadSummary: "Download Summary",
    markAsAddressed: "Mark as Addressed",
    noComments: "No comments found",
    noInsights: "No actionable insights available",
    loading: "Loading...",
    error: "An error occurred",
    filmSentiment: "Film Sentiment Dashboard",
  },
  ar: {
    dashboard: "لوحة التحكم",
    comments: "التعليقات",
    insights: "الرؤى",
    executiveSummary: "الملخص التنفيذي",
    settings: "الإعدادات",
    totalComments: "إجمالي التعليقات",
    positiveRate: "معدل الإيجابية",
    viewerCuriosity: "فضول المشاهد",
    actionableInsights: "رؤى قابلة للتنفيذ",
    sentimentDistribution: "توزيع المشاعر",
    sentimentCounts: "أعداد المشاعر",
    topThemes: "المواضيع الرئيسية",
    commentsExplorer: "مستكشف التعليقات",
    postId: "معرف المنشور",
    comment: "التعليق",
    tone: "النبرة",
    themes: "المواضيع",
    questions: "الأسئلة",
    filterBySentiment: "تصفية حسب المشاعر",
    filterByTheme: "تصفية حسب الموضوع",
    search: "البحث في التعليقات...",
    all: "الكل",
    positive: "إيجابي",
    negative: "سلبي",
    neutral: "محايد",
    mixed: "مختلط",
    export: "تصدير",
    exportCSV: "تصدير CSV",
    downloadSummary: "تحميل الملخص",
    markAsAddressed: "وضع علامة كمعالج",
    noComments: "لم يتم العثور على تعليقات",
    noInsights: "لا توجد رؤى قابلة للتنفيذ",
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    filmSentiment: "لوحة تحليل مشاعر الأفلام",
  },
  fr: {
    dashboard: "Tableau de bord",
    comments: "Commentaires",
    insights: "Insights",
    executiveSummary: "Résumé exécutif",
    settings: "Paramètres",
    totalComments: "Total des commentaires",
    positiveRate: "Taux positif",
    viewerCuriosity: "Curiosité du spectateur",
    actionableInsights: "Insights actionnables",
    sentimentDistribution: "Distribution des sentiments",
    sentimentCounts: "Nombres de sentiments",
    topThemes: "Thèmes principaux",
    commentsExplorer: "Explorateur de commentaires",
    postId: "ID du post",
    comment: "Commentaire",
    tone: "Ton",
    themes: "Thèmes",
    questions: "Questions",
    filterBySentiment: "Filtrer par sentiment",
    filterByTheme: "Filtrer par thème",
    search: "Rechercher des commentaires...",
    all: "Tous",
    positive: "Positif",
    negative: "Négatif",
    neutral: "Neutre",
    mixed: "Mixte",
    export: "Exporter",
    exportCSV: "Exporter CSV",
    downloadSummary: "Télécharger le résumé",
    markAsAddressed: "Marquer comme traité",
    noComments: "Aucun commentaire trouvé",
    noInsights: "Aucun insight actionnable disponible",
    loading: "Chargement...",
    error: "Une erreur s'est produite",
    filmSentiment: "Tableau de bord de sentiment de film",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
