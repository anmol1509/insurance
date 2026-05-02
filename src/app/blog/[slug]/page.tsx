import { getBlogPost, blogPosts, getCategoryColor } from '@/lib/blog'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://shopinsurance.com.ng/blog/${slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.publishedAt },
  }
}

function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let tableRows: string[] = []
  let inTable = false
  let key = 0

  const flushTable = () => {
    if (tableRows.length < 2) { tableRows = []; inTable = false; return }
    const [header, , ...body] = tableRows
    const headers = header.split('|').filter(Boolean).map(h => h.trim())
    elements.push(
      <div key={key++} className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-[14px] font-sans">
          <thead>
            <tr>{headers.map(h => <th key={h} className="text-left px-4 py-2.5 font-semibold border border-[var(--border-default)] bg-[var(--surface-raised)]" style={{ color: 'var(--text-primary)' }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {body.map((row, i) => {
              const cells = row.split('|').filter(Boolean).map(c => c.trim())
              return <tr key={i}>{cells.map((c, j) => <td key={j} className="px-4 py-2.5 border border-[var(--border-default)]" style={{ color: 'var(--text-secondary)' }}>{c}</td>)}</tr>
            })}
          </tbody>
        </table>
      </div>
    )
    tableRows = []; inTable = false
  }

  for (const line of lines) {
    if (line.startsWith('|')) {
      inTable = true
      tableRows.push(line)
      continue
    }
    if (inTable) flushTable()

    if (!line.trim()) { elements.push(<br key={key++} />); continue }
    if (line.startsWith('## ')) { elements.push(<h2 key={key++} className="font-display font-bold text-[22px] mt-8 mb-3" style={{ color: 'var(--text-primary)' }}>{line.slice(3)}</h2>); continue }
    if (line.startsWith('### ')) { elements.push(<h3 key={key++} className="font-display font-semibold text-[18px] mt-6 mb-2" style={{ color: 'var(--text-primary)' }}>{line.slice(4)}</h3>); continue }
    if (line.startsWith('- ') || line.startsWith('✅ ')) {
      const text = line.replace(/^[-✅] /, '')
      elements.push(
        <div key={key++} className="flex items-start gap-2 my-1">
          <span style={{ color: 'var(--green-700)' }} className="mt-0.5 shrink-0">✓</span>
          <span className="font-sans text-[15px]" style={{ color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
        </div>
      )
      continue
    }
    if (/^\d+\./.test(line)) {
      const text = line.replace(/^\d+\.\s*/, '')
      elements.push(
        <div key={key++} className="flex items-start gap-2 my-1.5">
          <span className="font-sans font-bold text-sm shrink-0 mt-0.5" style={{ color: 'var(--green-700)' }}>{line.match(/^\d+/)?.[0]}.</span>
          <span className="font-sans text-[15px]" style={{ color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
        </div>
      )
      continue
    }
    elements.push(
      <p key={key++} className="font-sans text-[15px] leading-relaxed my-2" style={{ color: 'var(--text-secondary)' }}
        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
    )
  }
  if (inTable) flushTable()
  return elements
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const catColor = getCategoryColor(post.category)
  const related = blogPosts.filter(p => p.slug !== slug && p.category === post.category).slice(0, 2)

  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Hero */}
      <div className="bg-white border-b border-[var(--border-default)] py-12 px-5 lg:px-20">
        <div className="max-w-[760px] mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <Link href="/blog" className="font-sans text-[13px] hover:underline" style={{ color: 'var(--text-muted)' }}>Blog</Link>
            <span style={{ color: 'var(--text-subtle)' }}>›</span>
            <span className="font-sans font-semibold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wide" style={{ backgroundColor: `color-mix(in srgb, ${catColor} 12%, white)`, color: catColor }}>{post.category}</span>
          </div>
          <h1 className="font-display font-extrabold text-[32px] lg:text-[38px] leading-tight tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            {post.title}
          </h1>
          <p className="font-sans text-[17px] leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>{post.excerpt}</p>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold" style={{ backgroundColor: 'var(--green-100)', color: 'var(--green-700)' }}>
              {post.author.name[0]}
            </div>
            <div>
              <p className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>{post.author.name}</p>
              <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
                {post.author.role} · {new Date(post.publishedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })} · {post.readTime} min read
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[760px] mx-auto px-5 lg:px-0 py-10">
        <div className="bg-white rounded-3xl border border-[var(--border-default)] p-8 lg:p-12 mb-8">
          {renderContent(post.content)}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {post.tags.map(tag => (
            <span key={tag} className="font-sans text-[12px] px-3 py-1 rounded-full border" style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-3xl p-8 mb-10 text-center" style={{ backgroundColor: 'var(--green-700)' }}>
          <p className="font-display font-bold text-[22px] text-white mb-2">Ready to get covered?</p>
          <p className="font-sans text-sm text-white/80 mb-5">Compare plans from multiple NAICOM-licensed insurers — free, instant quotes.</p>
          <Link href="/quote/motor" className="inline-flex items-center h-11 px-7 bg-white rounded-xl font-sans font-bold text-[14px]" style={{ color: 'var(--green-700)' }}>
            Get a free quote →
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-xl mb-5" style={{ color: 'var(--text-primary)' }}>Related articles</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="bg-white rounded-2xl border border-[var(--border-default)] p-5 hover:shadow-md transition-shadow">
                  <span className="text-3xl block mb-3">{p.coverEmoji}</span>
                  <h3 className="font-display font-bold text-[15px] leading-snug hover:underline" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                  <p className="font-sans text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>{p.readTime} min read</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
