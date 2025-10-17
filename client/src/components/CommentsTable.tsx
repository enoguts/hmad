import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Search } from 'lucide-react';
import { AnalyzedComment } from '@shared/schema';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentsTableProps {
  comments: AnalyzedComment[];
}

export function CommentsTable({ comments }: CommentsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toneFilter, setToneFilter] = useState<string>('all');
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const filteredComments = comments.filter((comment) => {
    const matchesSearch = comment.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.post_id.includes(searchQuery);
    const matchesTone = toneFilter === 'all' || comment.analysis.sentiment.overall_tone.toLowerCase() === toneFilter.toLowerCase();
    return matchesSearch && matchesTone;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Comment copied to clipboard',
      duration: 2000,
    });
  };

  const getToneBadgeColor = (tone: string) => {
    const lowerTone = tone.toLowerCase();
    if (lowerTone.includes('positive')) return 'bg-chart-1/20 text-chart-1 border-chart-1/30';
    if (lowerTone.includes('negative')) return 'bg-chart-5/20 text-chart-5 border-chart-5/30';
    if (lowerTone.includes('neutral')) return 'bg-chart-4/20 text-chart-4 border-chart-4/30';
    if (lowerTone.includes('mixed')) return 'bg-chart-2/20 text-chart-2 border-chart-2/30';
    return 'bg-muted/20 text-muted-foreground border-muted/30';
  };

  return (
    <Card className="backdrop-blur-xl bg-card/40 border-card-border p-6" data-testid="comments-table">
      <div className="flex flex-col gap-4 mb-6">
        <h3 className="text-lg font-semibold">{t('commentsExplorer')}</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchComments')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-comments"
            />
          </div>
          <Select value={toneFilter} onValueChange={setToneFilter}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-tone-filter">
              <SelectValue placeholder={t('filterByTone')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allTones')}</SelectItem>
              <SelectItem value="positive">{t('positive')}</SelectItem>
              <SelectItem value="negative">{t('negative')}</SelectItem>
              <SelectItem value="neutral">{t('neutral')}</SelectItem>
              <SelectItem value="mixed">{t('mixed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('noComments')}
          </div>
        ) : (
          filteredComments.map((comment, index) => (
            <motion.div
              key={comment.post_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <div
                className="rounded-lg border border-border bg-card/30 overflow-hidden hover-elevate transition-all"
                data-testid={`comment-row-${index}`}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === comment.post_id ? null : comment.post_id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground font-mono truncate">
                          {comment.post_id}
                        </span>
                        <Badge
                          variant="outline"
                          className={getToneBadgeColor(comment.analysis.sentiment.overall_tone)}
                        >
                          {comment.analysis.sentiment.overall_tone}
                        </Badge>
                        {comment.language && (
                          <Badge variant="outline" className="text-xs">
                            {comment.language.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm line-clamp-2" dir="auto">
                        {comment.comment}
                      </p>
                      {comment.analysis.themes_and_topics.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {comment.analysis.themes_and_topics.slice(0, 3).map((theme, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {theme}
                            </Badge>
                          ))}
                          {comment.analysis.themes_and_topics.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{comment.analysis.themes_and_topics.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(comment.comment);
                        }}
                        data-testid={`button-copy-${index}`}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {expandedId === comment.post_id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === comment.post_id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-border/50 space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Sentiment Breakdown</h4>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-chart-1/10 rounded p-2">
                              <div className="text-muted-foreground">Positive</div>
                              <div className="font-semibold">{comment.analysis.sentiment.breakdown.positive_percent}%</div>
                            </div>
                            <div className="bg-chart-4/10 rounded p-2">
                              <div className="text-muted-foreground">Neutral</div>
                              <div className="font-semibold">{comment.analysis.sentiment.breakdown.neutral_percent}%</div>
                            </div>
                            <div className="bg-chart-5/10 rounded p-2">
                              <div className="text-muted-foreground">Negative</div>
                              <div className="font-semibold">{comment.analysis.sentiment.breakdown.negative_percent}%</div>
                            </div>
                          </div>
                        </div>

                        {comment.analysis.viewer_questions.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Viewer Questions</h4>
                            <ul className="space-y-1">
                              {comment.analysis.viewer_questions.map((q, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                  • {q.question} <span className="text-xs">({q.type})</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {comment.analysis.actionable_insights.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Actionable Insights</h4>
                            <ul className="space-y-1">
                              {comment.analysis.actionable_insights.map((insight, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                  • {insight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-semibold mb-1">Commentary</h4>
                          <p className="text-sm text-muted-foreground italic">
                            {comment.analysis.sentiment.commentary}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
