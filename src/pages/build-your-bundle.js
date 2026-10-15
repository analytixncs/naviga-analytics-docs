import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@theme/Layout';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import {
  FiDownload,
  FiExternalLink,
  FiSearch,
  FiCheck,
  FiX,
  FiPackage,
  FiDatabase,
  FiFileText,
  FiFolder,
  FiUsers,
  FiBarChart2,
  FiDollarSign,
  FiCpu,
  FiLayers,
  FiInfo,
  FiLoader,
} from 'react-icons/fi';
import { mergeBundles } from '../utils/mergeBundles';
import styles from './build-your-bundle.module.css';

const CATEGORY_ICONS = {
  Clients: FiUsers,
  Campaigns: FiBarChart2,
  'Informer Metadata': FiCpu,
  'AR and GL': FiDollarSign,
  Other: FiFolder,
};

export default function BuildYourBundlePage() {
  const { withBaseUrl } = useBaseUrlUtils();
  const indexUrl = withBaseUrl('/downloads/report-library/index.json');

  const [catalog, setCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState(null);

  const [selectedSlugs, setSelectedSlugs] = useState(new Set());
  const [bundleName, setBundleName] = useState('Custom Informer Bundle');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [isMerging, setIsMerging] = useState(false);
  const [mergeError, setMergeError] = useState(null);

  useEffect(() => {
    fetch(indexUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load catalog (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setCatalog(data.items || []);
        setLoadingCatalog(false);
      })
      .catch((err) => {
        setCatalogError(err.message);
        setLoadingCatalog(false);
      });
  }, [indexUrl]);

  // Counts for filter pills
  const typeCounts = useMemo(() => {
    return {
      all: catalog.length,
      dataset: catalog.filter((i) => i.type === 'dataset').length,
      query: catalog.filter((i) => i.type === 'query').length,
    };
  }, [catalog]);

  // Grouped and filtered items
  const groupedItems = useMemo(() => {
    const groups = {};
    const q = searchQuery.trim().toLowerCase();

    for (const item of catalog) {
      if (typeFilter !== 'all' && item.type !== typeFilter) continue;
      if (
        q &&
        !item.title.toLowerCase().includes(q) &&
        !(item.description || '').toLowerCase().includes(q) &&
        !(item.category || '').toLowerCase().includes(q) &&
        !(item.datasources || []).some((ds) => ds.toLowerCase().includes(q))
      ) {
        continue;
      }

      const cat = item.category || 'Uncategorized';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    }
    return groups;
  }, [catalog, searchQuery, typeFilter]);

  // Total items currently matching filter
  const visibleItems = useMemo(() => {
    return Object.values(groupedItems).flat();
  }, [groupedItems]);

  const toggleItem = (slug) => {
    setMergeError(null);
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const toggleCategory = (items) => {
    setMergeError(null);
    const allSelected = items.every((i) => selectedSlugs.has(i.slug));
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      for (const item of items) {
        if (allSelected) next.delete(item.slug);
        else next.add(item.slug);
      }
      return next;
    });
  };

  const selectAllVisible = () => {
    setMergeError(null);
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      for (const item of visibleItems) {
        next.add(item.slug);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setMergeError(null);
    setSelectedSlugs(new Set());
  };

  const handleDownload = async () => {
    if (selectedSlugs.size === 0) return;
    setIsMerging(true);
    setMergeError(null);

    try {
      const selectedItems = catalog.filter((i) => selectedSlugs.has(i.slug));

      const buffers = await Promise.all(
        selectedItems.map(async (item) => {
          const fetchUrl = withBaseUrl(item.tgzUrl);
          const res = await fetch(fetchUrl);
          if (!res.ok) throw new Error(`Failed to download "${item.title}" (${res.status})`);
          return new Uint8Array(await res.arrayBuffer());
        })
      );

      const finalName = bundleName.trim() || 'Custom Informer Bundle';
      const mergedBytes = await mergeBundles(buffers, finalName);

      const blob = new Blob([mergedBytes], { type: 'application/gzip' });
      const url = URL.createObjectURL(blob);
      const safeFilename = finalName.replace(/[^a-z0-9_-]/gi, '_');

      const a = document.createElement('a');
      a.href = url;
      a.download = `${safeFilename}.tgz`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setMergeError(err.message);
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <Layout
      title="Build Your Bundle"
      description="Select and merge Informer Report Library items into a single downloadable bundle archive."
    >
      <main className={styles.pageWrapper}>
        {/* Hero Header */}
        <header className={styles.heroHeader}>
          <h1 className={styles.heroTitle}>
            <FiPackage style={{ color: 'var(--bundle-primary)' }} />
            Build Your Bundle
          </h1>
          <p className={styles.heroSubtitle}>
            Select multiple datasets and ad hoc queries from the Report Library to package into a single{' '}
            <code>.tgz</code> archive. When complete, download and drag the bundle directly into Informer to import
            all selected assets in one step.
          </p>

          <div className={styles.metaChipsRow}>
            <span className={styles.metaChip}>
              <FiCheck size={13} style={{ color: '#10b981' }} /> Informer v5.8.6 Compatible
            </span>
            <span className={styles.metaChip}>
              <FiLayers size={13} style={{ color: 'var(--bundle-primary)' }} /> {catalog.length} Library Items Available
            </span>
            <span className={styles.metaChip}>
              <FiDatabase size={13} style={{ color: '#0284c7' }} /> Browser-Side Merging
            </span>
          </div>
        </header>

        {/* Warning / Informational Callout */}
        <aside className={styles.noticeBanner} aria-label="Import notice">
          <FiInfo className={styles.noticeIcon} />
          <p className={styles.noticeText}>
            <strong>Import Notice:</strong> Shared records (such as saved functions, user accounts, and tenants) are
            packaged within every bundle. Importing this bundle into Informer may overwrite matching records on your
            target environment with the definitions contained in these bundles.
          </p>
        </aside>

        {/* Floating Sticky Command Bar */}
        <section className={styles.stickyToolbar} aria-label="Bundle controls">
          <div className={styles.toolbarGrid}>
            {/* 1. Bundle Name */}
            <div className={styles.inputGroup}>
              <label htmlFor="bundle-name" className={styles.inputLabel}>
                <FiPackage size={13} /> Bundle Archive Name
              </label>
              <div className={styles.inputWrapper}>
                <FiFileText className={styles.inputIcon} />
                <input
                  id="bundle-name"
                  type="text"
                  className={styles.textInput}
                  placeholder="e.g. Sales and Finance Bundle"
                  value={bundleName}
                  onChange={(e) => setBundleName(e.target.value)}
                />
              </div>
            </div>

            {/* 2. Filter & Search */}
            <div className={styles.inputGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="search-filter" className={styles.inputLabel}>
                  <FiSearch size={13} /> Filter Library
                </label>
                {/* Type Filter Pills */}
                <div className={styles.filterPillsContainer} role="group" aria-label="Filter by type">
                  <button
                    type="button"
                    className={clsx(styles.filterPill, typeFilter === 'all' && styles.filterPillActive)}
                    onClick={() => setTypeFilter('all')}
                  >
                    All ({typeCounts.all})
                  </button>
                  <button
                    type="button"
                    className={clsx(styles.filterPill, typeFilter === 'dataset' && styles.filterPillActive)}
                    onClick={() => setTypeFilter('dataset')}
                  >
                    Datasets ({typeCounts.dataset})
                  </button>
                  <button
                    type="button"
                    className={clsx(styles.filterPill, typeFilter === 'query' && styles.filterPillActive)}
                    onClick={() => setTypeFilter('query')}
                  >
                    Queries ({typeCounts.query})
                  </button>
                </div>
              </div>

              <div className={styles.inputWrapper}>
                <FiSearch className={styles.inputIcon} />
                <input
                  id="search-filter"
                  type="search"
                  className={styles.textInput}
                  placeholder="Search by title, description, or datasource..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.clearButton}
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <FiX size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* 3. Download Action Button */}
            <div className={styles.actionArea}>
              <button
                type="button"
                className={styles.downloadButton}
                disabled={selectedSlugs.size === 0 || isMerging}
                onClick={handleDownload}
              >
                {isMerging ? (
                  <>
                    <FiLoader className={clsx(styles.inlineDocLinkIcon, styles.spinAnimation)} size={18} />
                    <span>Building Bundle...</span>
                  </>
                ) : (
                  <>
                    <FiDownload size={18} />
                    <span>
                      {selectedSlugs.size === 0
                        ? 'Download Bundle'
                        : `Download Bundle (${selectedSlugs.size})`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sub bar: Selection Summary & Quick Actions */}
          <div className={styles.toolbarSubBar}>
            <div className={styles.selectionCount}>
              <span>
                Selection:{' '}
                <strong className={styles.selectionCountHighlight}>
                  {selectedSlugs.size} of {catalog.length} items
                </strong>
                {selectedSlugs.size > 0 && ` (${Math.round((selectedSlugs.size / (catalog.length || 1)) * 100)}%)`}
              </span>
            </div>

            <div className={styles.quickActions}>
              {visibleItems.length > 0 && (
                <button type="button" className={styles.textActionButton} onClick={selectAllVisible}>
                  Select All Visible ({visibleItems.length})
                </button>
              )}
              {selectedSlugs.size > 0 && (
                <button type="button" className={styles.textActionButton} onClick={clearSelection}>
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          {mergeError && (
            <div className="alert alert--danger margin-top--sm" style={{ borderRadius: '8px' }}>
              <strong>Merge Error:</strong> {mergeError}
            </div>
          )}
        </section>

        {/* Loading / Error States */}
        {loadingCatalog && (
          <div className={styles.emptyState}>
            <FiLoader className={clsx(styles.emptyStateIcon, styles.spinAnimation)} />
            <h2 className={styles.emptyStateTitle}>Loading Report Library...</h2>
            <p className={styles.emptyStateText}>Fetching available bundle metadata and manifests.</p>
          </div>
        )}

        {catalogError && (
          <div className="alert alert--danger margin-bottom--lg">
            <h4>Could not load catalog</h4>
            <p>{catalogError}</p>
          </div>
        )}

        {/* Empty Search State */}
        {!loadingCatalog && !catalogError && visibleItems.length === 0 && (
          <div className={styles.emptyState}>
            <FiSearch className={styles.emptyStateIcon} />
            <h2 className={styles.emptyStateTitle}>No items match your filter</h2>
            <p className={styles.emptyStateText}>
              No items were found matching <strong>"{searchQuery}"</strong>
              {typeFilter !== 'all' && ` with type "${typeFilter}"`}.
            </p>
            <button
              type="button"
              className="button button--secondary button--sm"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Category Groups and Item Rows */}
        {!loadingCatalog &&
          !catalogError &&
          Object.entries(groupedItems).map(([category, items]) => {
            const CategoryIcon = CATEGORY_ICONS[category] || FiLayers;
            const selectedInCategory = items.filter((i) => selectedSlugs.has(i.slug)).length;
            const allSelected = items.length > 0 && selectedInCategory === items.length;

            return (
              <div key={category} className={styles.categoryCard}>
                {/* Category Header */}
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryTitleGroup}>
                    <CategoryIcon className={styles.categoryIcon} />
                    <h2 className={styles.categoryTitle}>{category}</h2>
                    <span
                      className={clsx(
                        styles.categoryBadge,
                        selectedInCategory > 0 && styles.categoryBadgeActive
                      )}
                    >
                      {selectedInCategory > 0
                        ? `${selectedInCategory} of ${items.length} selected`
                        : `${items.length} items`}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={styles.toggleCategoryButton}
                    onClick={() => toggleCategory(items)}
                    aria-label={`${allSelected ? 'Deselect' : 'Select'} all in ${category}`}
                  >
                    <FiCheck size={14} style={{ opacity: allSelected ? 1 : 0.4 }} />
                    <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
                  </button>
                </div>

                {/* Items in Category */}
                <div className={styles.itemsList} role="list">
                  {items.map((item) => {
                    const isSelected = selectedSlugs.has(item.slug);

                    return (
                      <div
                        key={item.slug}
                        role="listitem"
                        tabIndex={0}
                        aria-checked={isSelected}
                        className={clsx(styles.itemRow, isSelected && styles.itemRowSelected)}
                        onClick={() => toggleItem(item.slug)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            toggleItem(item.slug);
                          }
                        }}
                      >
                        {/* Checkbox */}
                        <div className={styles.checkboxContainer}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            tabIndex={-1}
                            className={styles.customCheckbox}
                            aria-label={`Select ${item.title}`}
                          />
                        </div>

                        {/* Item Main Body */}
                        <div className={styles.itemMainContent}>
                          {/* Header Line: Title, Type Badge, and Info Link inline */}
                          <div className={styles.itemHeaderLine}>
                            <span className={styles.itemTitle}>{item.title}</span>

                            <span
                              className={clsx(
                                styles.typeBadge,
                                item.type === 'dataset' ? styles.typeBadgeDataset : styles.typeBadgeQuery
                              )}
                            >
                              {item.type === 'dataset' ? <FiDatabase size={11} /> : <FiFileText size={11} />}
                              <span>{item.type === 'dataset' ? 'Dataset' : 'Ad Hoc Query'}</span>
                            </span>

                            {/* Info / Documentation link - positioned directly beside the badge! */}
                            {item.docUrl && (
                              <a
                                href={withBaseUrl(item.docUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.inlineDocLink}
                                onClick={(e) => e.stopPropagation()}
                                title={`Open documentation for ${item.title} in a new tab`}
                              >
                                <span>Docs</span>
                                <FiExternalLink className={styles.inlineDocLinkIcon} />
                              </a>
                            )}
                          </div>

                          {/* Description */}
                          {item.description && (
                            <p className={styles.itemDescription}>{item.description}</p>
                          )}

                          {/* Datasource Metadata Tags */}
                          {item.datasources && item.datasources.length > 0 && (
                            <div className={styles.itemFooterMeta}>
                              {item.datasources.map((ds) => (
                                <span key={ds} className={styles.datasourceTag} title={`Datasource: ${ds}`}>
                                  <FiDatabase size={10} />
                                  <span>{ds}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </main>
    </Layout>
  );
}
