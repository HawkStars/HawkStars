'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Gutter } from '@payloadcms/ui';
import { useAuth } from '@payloadcms/ui';

type Stats = {
  collections: {
    artCollection: number;
    boardMembers: number;
    contributions: number;
    curators: number;
    hawkProjects: number;
    partners: number;
    pages: number;
    media: number;
    users: number;
    news: number;
  };
  contributions: {
    totalValue: number;
    confirmedValue: number;
    totalCount: number;
    confirmedCount: number;
    byType: Record<string, { count: number; total: number }>;
  };
};

type RecentDoc = {
  id: string;
  title?: string;
  name?: string;
  slug?: string;
  updatedAt: string;
  _status?: string;
};

const formatCurrency = (value: number) =>
  `€${value.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const collections = [
  { slug: 'pages', label: 'Pages', icon: '📄', description: 'Website pages & layouts' },
  { slug: 'news', label: 'News', icon: '📰', description: 'News articles & blog posts' },
  {
    slug: 'hawk_projects',
    label: 'Projects',
    icon: '🚀',
    description: 'HawkStars initiatives',
  },
  { slug: 'artworks', label: 'Art Collection', icon: '🎨', description: 'Artworks & exhibits' },
  { slug: 'contributions', label: 'Contributions', icon: '💰', description: 'Donations & support' },
  { slug: 'board-members', label: 'Board Members', icon: '👥', description: 'Team & leadership' },
  { slug: 'partners', label: 'Partners', icon: '🤝', description: 'Partner organizations' },
  { slug: 'curators', label: 'Curators', icon: '🎯', description: 'Art curators' },
  { slug: 'media', label: 'Media', icon: '🖼️', description: 'Images & files' },
  { slug: 'users', label: 'Users', icon: '👤', description: 'Admin users' },
] as const;

const globals = [
  { slug: 'header', label: 'Header', icon: '🔝', description: 'Site navigation & logo' },
  { slug: 'footer', label: 'Footer', icon: '🔻', description: 'Footer links & info' },
  { slug: 'main-page', label: 'Main Page', icon: '🏠', description: 'Homepage content' },
  { slug: 'news-list', label: 'News List', icon: '📋', description: 'News listing config' },
  {
    slug: 'projects-list',
    label: 'Projects List',
    icon: '📑',
    description: 'Projects listing config',
  },
] as const;

const statsKeyMap: Record<string, keyof Stats['collections']> = {
  pages: 'pages',
  news: 'news',
  hawk_projects: 'hawkProjects',
  artworks: 'artCollection',
  contributions: 'contributions',
  'board-members': 'boardMembers',
  partners: 'partners',
  curators: 'curators',
  media: 'media',
  users: 'users',
};

const CustomDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentPages, setRecentPages] = useState<RecentDoc[]>([]);
  const [recentNews, setRecentNews] = useState<RecentDoc[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, pagesRes, newsRes, projectsRes] = await Promise.all([
          fetch('/api/dashboard-stats'),
          fetch('/api/pages?limit=5&sort=-updatedAt&depth=0'),
          fetch('/api/news?limit=5&sort=-updatedAt&depth=0'),
          fetch('/api/hawk_projects?limit=5&sort=-updatedAt&depth=0'),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        if (pagesRes.ok) {
          const pagesData = await pagesRes.json();
          setRecentPages(pagesData.docs || []);
        }
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setRecentNews(newsData.docs || []);
        }
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setRecentProjects(projectsData.docs || []);
        }
      } catch {
        // Stats will remain null, UI handles gracefully
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Gutter>
      <div className='py-8'>
        {/* Hero Welcome */}
        <div className='mb-8 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-lg'>
          <h1 className='mb-2 text-3xl font-bold'>
            {greeting()}, {user?.email?.split('@')[0] || 'Admin'} 👋
          </h1>
          <p className='text-blue-100'>
            Welcome to the HawkStars admin panel. Manage content across Portuguese and English
            versions of the website.
          </p>

          {/* Contribution highlight */}
          {stats && (
            <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <div className='rounded-lg bg-white/15 p-4 backdrop-blur-sm'>
                <p className='text-sm text-blue-200'>Total Contributions</p>
                <p className='text-2xl font-bold'>
                  {formatCurrency(stats.contributions.totalValue)}
                </p>
                <p className='text-xs text-blue-200'>
                  {stats.contributions.totalCount} contributions
                </p>
              </div>
              <div className='rounded-lg bg-white/15 p-4 backdrop-blur-sm'>
                <p className='text-sm text-blue-200'>Confirmed</p>
                <p className='text-2xl font-bold'>
                  {formatCurrency(stats.contributions.confirmedValue)}
                </p>
                <p className='text-xs text-blue-200'>
                  {stats.contributions.confirmedCount} confirmed
                </p>
              </div>
              <div className='rounded-lg bg-white/15 p-4 backdrop-blur-sm'>
                <p className='text-sm text-blue-200'>Pending</p>
                <p className='text-2xl font-bold'>
                  {formatCurrency(
                    stats.contributions.totalValue - stats.contributions.confirmedValue
                  )}
                </p>
                <p className='text-xs text-blue-200'>
                  {stats.contributions.totalCount - stats.contributions.confirmedCount} pending
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <section className='mb-8'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            Quick Actions
          </h2>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            <Link
              href='/admin/collections/pages/create'
              className='flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/40'
            >
              <span className='text-2xl'>📄</span>
              <div>
                <p className='font-medium text-blue-800 dark:text-blue-300'>New Page</p>
                <p className='text-xs text-blue-600 dark:text-blue-400'>Create a website page</p>
              </div>
            </Link>
            <Link
              href='/admin/collections/news/create'
              className='flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 transition-colors hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:hover:bg-green-900/40'
            >
              <span className='text-2xl'>📰</span>
              <div>
                <p className='font-medium text-green-800 dark:text-green-300'>New Article</p>
                <p className='text-xs text-green-600 dark:text-green-400'>Publish a news article</p>
              </div>
            </Link>
            <Link
              href='/admin/collections/hawk_projects/create'
              className='flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4 transition-colors hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-900/20 dark:hover:bg-purple-900/40'
            >
              <span className='text-2xl'>🚀</span>
              <div>
                <p className='font-medium text-purple-800 dark:text-purple-300'>New Project</p>
                <p className='text-xs text-purple-600 dark:text-purple-400'>
                  Add a HawkStars project
                </p>
              </div>
            </Link>
            <Link
              href='/admin/collections/media/create'
              className='flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 transition-colors hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900/20 dark:hover:bg-orange-900/40'
            >
              <span className='text-2xl'>🖼️</span>
              <div>
                <p className='font-medium text-orange-800 dark:text-orange-300'>Upload Media</p>
                <p className='text-xs text-orange-600 dark:text-orange-400'>Add images & files</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Collections Grid */}
        <section className='mb-8'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            Collections
          </h2>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5'>
            {collections.map((col) => (
              <Link
                key={col.slug}
                href={`/admin/collections/${col.slug}`}
                className='group flex flex-col gap-1 rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:hover:border-blue-600'
              >
                <div className='flex items-center justify-between'>
                  <span className='text-2xl'>{col.icon}</span>
                  {stats && statsKeyMap[col.slug] && (
                    <span className='rounded-full bg-gray-100 px-2 py-0.5 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                      {stats.collections[statsKeyMap[col.slug]]}
                    </span>
                  )}
                </div>
                <p className='font-medium text-gray-800 group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400'>
                  {col.label}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{col.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Globals */}
        <section className='mb-8'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            Global Settings
          </h2>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5'>
            {globals.map((global) => (
              <Link
                key={global.slug}
                href={`/admin/globals/${global.slug}`}
                className='group flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-indigo-300 hover:shadow-md dark:border-gray-700 dark:hover:border-indigo-600'
              >
                <span className='text-xl'>{global.icon}</span>
                <div>
                  <p className='font-medium text-gray-800 group-hover:text-indigo-600 dark:text-gray-200 dark:group-hover:text-indigo-400'>
                    {global.label}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>{global.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className='mb-8'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            Recent Activity
          </h2>
          {loading ? (
            <div className='flex items-center gap-3 text-gray-500'>
              <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500' />
              Loading recent activity...
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
              {/* Recent Pages */}
              <div className='rounded-lg border border-gray-200 dark:border-gray-700'>
                <div className='border-b border-gray-200 p-4 dark:border-gray-700'>
                  <h3 className='flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300'>
                    📄 Recent Pages
                  </h3>
                </div>
                <div className='divide-y divide-gray-100 dark:divide-gray-800'>
                  {recentPages.length === 0 && (
                    <p className='p-4 text-sm text-gray-400'>No pages yet</p>
                  )}
                  {recentPages.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/admin/collections/pages/${doc.id}`}
                      className='flex items-center justify-between p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    >
                      <span className='truncate text-sm text-gray-700 dark:text-gray-300'>
                        {doc.title || doc.slug || doc.id}
                      </span>
                      <span className='shrink-0 text-xs text-gray-400'>
                        {timeAgo(doc.updatedAt)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent News */}
              <div className='rounded-lg border border-gray-200 dark:border-gray-700'>
                <div className='border-b border-gray-200 p-4 dark:border-gray-700'>
                  <h3 className='flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300'>
                    📰 Recent News
                  </h3>
                </div>
                <div className='divide-y divide-gray-100 dark:divide-gray-800'>
                  {recentNews.length === 0 && (
                    <p className='p-4 text-sm text-gray-400'>No news yet</p>
                  )}
                  {recentNews.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/admin/collections/news/${doc.id}`}
                      className='flex items-center justify-between p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    >
                      <span className='truncate text-sm text-gray-700 dark:text-gray-300'>
                        {doc.title || doc.slug || doc.id}
                      </span>
                      <div className='flex shrink-0 items-center gap-2'>
                        {doc._status && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              doc._status === 'published'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}
                          >
                            {doc._status}
                          </span>
                        )}
                        <span className='text-xs text-gray-400'>{timeAgo(doc.updatedAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Projects */}
              <div className='rounded-lg border border-gray-200 dark:border-gray-700'>
                <div className='border-b border-gray-200 p-4 dark:border-gray-700'>
                  <h3 className='flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300'>
                    🚀 Recent Projects
                  </h3>
                </div>
                <div className='divide-y divide-gray-100 dark:divide-gray-800'>
                  {recentProjects.length === 0 && (
                    <p className='p-4 text-sm text-gray-400'>No projects yet</p>
                  )}
                  {recentProjects.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/admin/collections/hawk_projects/${doc.id}`}
                      className='flex items-center justify-between p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    >
                      <span className='truncate text-sm text-gray-700 dark:text-gray-300'>
                        {doc.title || doc.name || doc.slug || doc.id}
                      </span>
                      <div className='flex shrink-0 items-center gap-2'>
                        {doc._status && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              doc._status === 'published'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}
                          >
                            {doc._status}
                          </span>
                        )}
                        <span className='text-xs text-gray-400'>{timeAgo(doc.updatedAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Contribution Breakdown */}
        {stats && Object.keys(stats.contributions.byType).length > 0 && (
          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200'>
              Contributions by Type
            </h2>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
              {Object.entries(stats.contributions.byType).map(([type, data]) => {
                const labels: Record<string, string> = {
                  BANK: 'Bank Transfer',
                  CRYPTO: 'Cryptocurrency',
                  WALL_NAME_SINGULAR: 'Individual Wall Name',
                  WALL_NAME_COMPANY: 'Company Wall Name',
                  OFFICE_CHAIR: 'Office Chair',
                  SIMULATOR_CHAIR: 'Simulator Chair',
                  LOUNGE_CHAIR: 'Lounge Chair',
                  AUDITORIUM_CHAIR: 'Auditorium Chair',
                  BUILDING_NAMING: 'Building Naming',
                  TRAINING_ROOM_NAMING: 'Training Room Naming',
                };
                return (
                  <div
                    key={type}
                    className='flex flex-col gap-1 rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                  >
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {labels[type] || type}
                    </p>
                    <p className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
                      {data.count}
                    </p>
                    <p className='text-sm text-green-600 dark:text-green-400'>
                      {formatCurrency(data.total)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className='mt-8 text-center text-sm text-gray-400'>
          HawkStars Admin Dashboard &middot; Payload CMS
        </div>
      </div>
    </Gutter>
  );
};

export default CustomDashboard;
