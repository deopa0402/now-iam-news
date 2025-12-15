'use client'

import Image from 'next/image'
import { MessageCircle, ThumbsUp, Reply } from 'lucide-react'
import type { Comment } from '@/lib/articles'

interface CommentsProps {
  comments?: Comment[]
}

export function Comments({ comments = [] }: CommentsProps) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center gap-2 mb-8">
        <MessageCircle className="w-6 h-6" />
        <h2 className="text-2xl font-bold">댓글 {comments.length}개</h2>
      </div>

      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-6 last:border-b-0">
            <div className="flex gap-4">
              {/* 프로필 이미지 */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden relative">
                  {comment.avatar ? (
                    <Image
                      src={comment.avatar}
                      alt={comment.author}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold">
                      {comment.author[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* 댓글 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>

                <p className="text-sm text-foreground leading-relaxed mb-3">
                  {comment.content}
                </p>

                {/* 액션 버튼 (기능 없음, UI만) */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{comment.likes}</span>
                  </button>

                  {comment.replies !== undefined && comment.replies > 0 && (
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>답글 {comment.replies}개</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-muted/30 rounded-lg border border-dashed text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground mb-2">아직 댓글이 없습니다</p>
          <p className="text-sm text-muted-foreground/70">
            이 기사에 대한 첫 번째 의견을 남겨보세요!
          </p>
        </div>
      )}

      {/* 댓글 입력창 (기능 없음, UI만) */}
      <div className="mt-8 pt-6 border-t">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
            나
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="댓글을 입력하세요..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              disabled
            />
            <p className="text-xs text-muted-foreground mt-2">
              댓글 기능은 준비 중입니다
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
