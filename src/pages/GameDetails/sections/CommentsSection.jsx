import { memo, useCallback, useState } from 'react';
import { Heart, Send } from 'lucide-react';
import { Section } from '@components/layout';
import { Avatar, Button, TextArea } from '@ui';
import { useToast } from '@hooks/index';
import { cn } from '@utils/index';
import { MotionReveal } from '../shared';

export const CommentsSection = memo(function CommentsSection({ game }) {
  const { success } = useToast();
  const [draft, setDraft] = useState('');
  const [items, setItems] = useState(game.comments);
  const [liked, setLiked] = useState({});

  const submit = useCallback(
    (event) => {
      event.preventDefault();
      if (!draft.trim()) return;
      const next = {
        id: `local-${Date.now()}`,
        name: 'You',
        avatar: game.logo,
        date: 'Just now',
        body: draft.trim(),
        likes: 0,
        replies: [],
      };
      setItems((prev) => [next, ...prev]);
      setDraft('');
      success('Comment posted', 'Visible to the community thread');
    },
    [draft, game.logo, success],
  );

  const toggleLike = useCallback((id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <Section title="Comments" description="Join the conversation." spacing="md">
      <MotionReveal className="space-y-6">
        <form onSubmit={submit} className="rounded-xl border border-border bg-surface p-4 md:p-5 space-y-3">
          <TextArea
            label="Write a comment"
            placeholder="Share your thoughts…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" size="md" iconLeft={Send} disabled={!draft.trim()}>
              Post Comment
            </Button>
          </div>
        </form>

        <ul className="space-y-4" aria-label="Game comments">
          {items.map((comment) => (
            <li key={comment.id} className="rounded-xl border border-border bg-surface/80 p-4 md:p-5">
              <CommentItem
                comment={comment}
                liked={Boolean(liked[comment.id])}
                onLike={() => toggleLike(comment.id)}
              />
              {comment.replies?.length > 0 && (
                <ul className="mt-4 ml-4 sm:ml-12 space-y-3 border-l border-border pl-4">
                  {comment.replies.map((reply) => (
                    <li key={reply.id}>
                      <CommentItem
                        comment={reply}
                        liked={Boolean(liked[reply.id])}
                        onLike={() => toggleLike(reply.id)}
                        compact
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </MotionReveal>
    </Section>
  );
});

function CommentItem({ comment, liked, onLike, compact = false }) {
  return (
    <div className={cn('flex gap-3', compact && 'items-start')}>
      <Avatar src={comment.avatar} name={comment.name} size={compact ? 'sm' : 'md'} />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-baseline gap-2">
          <p className="text-sm font-medium text-text">{comment.name}</p>
          <span className="text-body-sm">{comment.date}</span>
        </div>
        <p className="text-body-md text-text-secondary">{comment.body}</p>
        <button
          type="button"
          onClick={onLike}
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-medium transition-colors',
            liked ? 'text-error' : 'text-text-muted hover:text-text',
          )}
          aria-pressed={liked}
          aria-label={liked ? 'Unlike comment' : 'Like comment'}
        >
          <Heart className={cn('h-3.5 w-3.5', liked && 'fill-current')} aria-hidden="true" />
          {(comment.likes ?? 0) + (liked ? 1 : 0)}
        </button>
      </div>
    </div>
  );
}
