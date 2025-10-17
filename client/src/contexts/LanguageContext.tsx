import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    comments: 'Comments',
    insights: 'Insights',
    summary: 'Summary',
    settings: 'Settings',
    totalComments: 'Total Comments',
    positiveRate: 'Positive Rate',
    viewerCuriosity: 'Viewer Curiosity',
    actionableInsights: 'Actionable Insights',
    sentimentOverview: 'Sentiment Overview',
    toneDistribution: 'Tone Distribution',
    toneCounts: 'Sentiment Counts',
    topThemes: 'Top Themes & Topics',
    commentsExplorer: 'Comments Explorer',
    actionableInsightsList: 'Actionable Insights',
    executiveSummary: 'Executive Summary',
    uploadData: 'Upload Data',
    downloadPDF: 'Download PDF',
    exportCSV: 'Export CSV',
    exportJSON: 'Export JSON',
    filterByTone: 'Filter by tone',
    searchComments: 'Search comments...',
    postId: 'Post ID',
    comment: 'Comment',
    tone: 'Tone',
    themes: 'Themes',
    questions: 'Questions',
    insight: 'Insight',
    language: 'Language',
    loadKPIData: 'Load KPI Data',
    loadComments: 'Load Comments',
    resetData: 'Reset to Sample Data',
    allTones: 'All Tones',
    positive: 'Positive',
    negative: 'Negative',
    neutral: 'Neutral',
    mixed: 'Mixed',
    noComments: 'No comments to display',
    noInsights: 'No actionable insights yet',
    uploadKPI: 'Upload overall_kpi.json',
    uploadCommentData: 'Upload analyzed_comments.json',
    dragDropFiles: 'Drag & drop files here or click to browse',
    filmProject: 'Film Analytics',
  },
  fr: {
    dashboard: 'Tableau de bord',
    comments: 'Commentaires',
    insights: 'Aperçus',
    summary: 'Résumé',
    settings: 'Paramètres',
    totalComments: 'Total Commentaires',
    positiveRate: 'Taux Positif',
    viewerCuriosity: 'Curiosité Spectateurs',
    actionableInsights: 'Insights Actionnables',
    sentimentOverview: 'Aperçu du Sentiment',
    toneDistribution: 'Distribution des Tons',
    toneCounts: 'Comptes de Sentiment',
    topThemes: 'Thèmes Principaux',
    commentsExplorer: 'Explorateur de Commentaires',
    actionableInsightsList: 'Insights Actionnables',
    executiveSummary: 'Résumé Exécutif',
    uploadData: 'Télécharger Données',
    downloadPDF: 'Télécharger PDF',
    exportCSV: 'Exporter CSV',
    exportJSON: 'Exporter JSON',
    filterByTone: 'Filtrer par ton',
    searchComments: 'Rechercher commentaires...',
    postId: 'ID Post',
    comment: 'Commentaire',
    tone: 'Ton',
    themes: 'Thèmes',
    questions: 'Questions',
    insight: 'Insight',
    language: 'Langue',
    loadKPIData: 'Charger KPI',
    loadComments: 'Charger Commentaires',
    resetData: 'Réinitialiser aux Données',
    allTones: 'Tous les Tons',
    positive: 'Positif',
    negative: 'Négatif',
    neutral: 'Neutre',
    mixed: 'Mixte',
    noComments: 'Aucun commentaire à afficher',
    noInsights: 'Aucun insight actionnable',
    uploadKPI: 'Télécharger overall_kpi.json',
    uploadCommentData: 'Télécharger analyzed_comments.json',
    dragDropFiles: 'Glisser-déposer les fichiers ici',
    filmProject: 'Analyse Cinéma',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    comments: 'التعليقات',
    insights: 'الرؤى',
    summary: 'الملخص',
    settings: 'الإعدادات',
    totalComments: 'إجمالي التعليقات',
    positiveRate: 'معدل إيجابي',
    viewerCuriosity: 'فضول المشاهدين',
    actionableInsights: 'رؤى قابلة للتنفيذ',
    sentimentOverview: 'نظرة عامة على المشاعر',
    toneDistribution: 'توزيع النبرة',
    toneCounts: 'عدد المشاعر',
    topThemes: 'المواضيع الرئيسية',
    commentsExplorer: 'مستكشف التعليقات',
    actionableInsightsList: 'رؤى قابلة للتنفيذ',
    executiveSummary: 'الملخص التنفيذي',
    uploadData: 'تحميل البيانات',
    downloadPDF: 'تحميل PDF',
    exportCSV: 'تصدير CSV',
    exportJSON: 'تصدير JSON',
    filterByTone: 'تصفية حسب النبرة',
    searchComments: 'البحث في التعليقات...',
    postId: 'معرف المنشور',
    comment: 'تعليق',
    tone: 'النبرة',
    themes: 'المواضيع',
    questions: 'الأسئلة',
    insight: 'رؤية',
    language: 'اللغة',
    loadKPIData: 'تحميل بيانات KPI',
    loadComments: 'تحميل التعليقات',
    resetData: 'إعادة تعيين للبيانات النموذجية',
    allTones: 'جميع النبرات',
    positive: 'إيجابي',
    negative: 'سلبي',
    neutral: 'محايد',
    mixed: 'مختلط',
    noComments: 'لا توجد تعليقات لعرضها',
    noInsights: 'لا توجد رؤى قابلة للتنفيذ',
    uploadKPI: 'تحميل overall_kpi.json',
    uploadCommentData: 'تحميل analyzed_comments.json',
    dragDropFiles: 'اسحب الملفات هنا أو انقر للتصفح',
    filmProject: 'تحليلات الأفلام',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
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
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
