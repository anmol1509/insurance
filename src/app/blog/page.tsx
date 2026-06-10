import Link from 'next/link'
import { blogPosts, getCategoryColor } from '@/lib/blog'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insurance Blog — Tips, Guides & News',
  description:
    'Expert guides on motor, health, travel and business insurance in Nigeria. Compare plans, understand your cover, and file claims with confidence.',
  alternates: { canonical: 'https://shopinsurance.com.ng/blog' },
}

const categories = ['All', 'Motor', 'Medical', 'Travel', 'Business', 'Guides']

export default function BlogPage() {
  const [featured, ...rest] = blogPosts

  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Hero */}
      <section className="bg-white border-b border-[var(--border-default)] py-14 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--green-700)' }}>
            ShopInsurance Blog
          </p>
          <h1 className="font-display font-extrabold text-[42px] tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            Insurance, simplified.
          </h1>
          <p className="font-sans text-[17px] max-w-[520px]" style={{ color: 'var(--text-muted)' }}>
            Practical guides for Nigerian consumers — from buying your first policy to filing a claim with confidence.
          </p>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((cat) => (
              <span
                key={cat}
                className="font-sans font-medium text-[13px] px-4 py-1.5 rounded-full border cursor-pointer transition-colors hover:bg-[var(--surface-raised)]"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-5 lg:px-20 py-12">
        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} className="group block mb-12">
          <div className="bg-white rounded-3xl border border-[var(--border-default)] overflow-hidden hover:shadow-lg transition-shadow duration-200 grid lg:grid-cols-[1fr_380px]">
            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-sans font-semibold text-[11px] px-3 py-1 rounded-full uppercase tracking-wide"
                  style={{ backgroundColor: `color-mix(in srgb, ${getCategoryColor(featured.category)} 12%, white)`, color: getCategoryColor(featured.category) }}
                >
                  {featured.category}
                </span>
                <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>Featured</span>
              </div>
              <h2 className="font-display font-extrabold text-[26px] leading-tight mb-3 group-hover:underline" style={{ color: 'var(--text-primary)' }}>
                {featured.title}
              </h2>
              <p className="font-sans text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--green-100)] flex items-center justify-center font-display font-bold text-sm" style={{ color: 'var(--green-700)' }}>
                  {featured.author.name[0]}
                </div>
                <div>
                  <p className="font-sans font-medium text-[13px]" style={{ color: 'var(--text-primary)' }}>{featured.author.name}</p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    {new Date(featured.publishedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })} · {featured.readTime} min read
                  </p>
                </div>
              </div>
            </div>
            <div
              className="hidden lg:flex items-center justify-center relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${getCategoryColor(featured.category)} 18%, white) 0%, color-mix(in srgb, ${getCategoryColor(featured.category)} 6%, white) 100%)` }}
            >
              <div
                className="absolute w-64 h-64 rounded-full opacity-30 -right-16 -top-16"
                style={{ backgroundColor: `color-mix(in srgb, ${getCategoryColor(featured.category)} 25%, white)` }}
              />
              <div
                className="absolute w-40 h-40 rounded-full opacity-30 -left-10 -bottom-10"
                style={{ backgroundColor: `color-mix(in srgb, ${getCategoryColor(featured.category)} 25%, white)` }}
              />
              <div className="w-28 h-28 rounded-3xl bg-white shadow-lg flex items-center justify-center text-[56px] relative group-hover:scale-105 transition-transform duration-200">
                {featured.coverEmoji}
              </div>
            </div>
          </div>
        </Link>

        {/* Grid */}
        <h2 className="font-display font-bold text-xl mb-6" style={{ color: 'var(--text-primary)' }}>Latest articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white rounded-3xl border border-[var(--border-default)] overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
              <div
                className="h-36 flex items-center justify-center relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${getCategoryColor(post.category)} 16%, white) 0%, color-mix(in srgb, ${getCategoryColor(post.category)} 5%, white) 100%)` }}
              >
                <div
                  className="absolute w-32 h-32 rounded-full opacity-30 -right-8 -top-8"
                  style={{ backgroundColor: `color-mix(in srgb, ${getCategoryColor(post.category)} 25%, white)` }}
                />
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-[32px] relative group-hover:scale-105 transition-transform duration-200">
                  {post.coverEmoji}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span
                  className="font-sans font-semibold text-[11px] px-2.5 py-0.5 rounded-full mb-3 w-fit uppercase tracking-wide"
                  style={{ backgroundColor: `color-mix(in srgb, ${getCategoryColor(post.category)} 12%, white)`, color: getCategoryColor(post.category) }}
                >
                  {post.category}
                </span>
                <h3 className="font-display font-bold text-base leading-tight mb-2 group-hover:underline flex-1" style={{ color: 'var(--text-primary)' }}>
                  {post.title}
                </h3>
                <p className="font-sans text-[13px] leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                  <span className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    {new Date(post.publishedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{post.readTime} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
