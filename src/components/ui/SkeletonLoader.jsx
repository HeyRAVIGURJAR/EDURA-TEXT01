import React from 'react';
import './SkeletonLoader.css';

/* ── Batch Card Skeleton (Dashboard grid) ── */
const SkeletonLoader = () => {
  return (
    <div className="skeleton-card">
      <div className="skel-img skel-bone" />
      <div className="skel-body">
        <div className="skel-title skel-bone" />
        <div className="skel-subtitle skel-bone" />
        <div className="skel-tags">
          <div className="skel-tag skel-bone" />
          <div className="skel-tag skel-bone" />
          <div className="skel-tag skel-bone" />
        </div>
        <div className="skel-bottom">
          <div className="skel-avatar skel-bone" />
          <div className="skel-price skel-bone" />
        </div>
      </div>
    </div>
  );
};

/* ── Batch Detail Page Skeleton ── */
export const BatchDetailSkeleton = () => {
  return (
    <div className="batch-detail-skeleton">
      <div className="skel-hero skel-bone" />
      <div className="skel-info-row">
        <div className="skel-circle skel-bone" />
        <div className="skel-text-group">
          <div className="skel-bone" style={{ height: '16px', width: '60%' }} />
          <div className="skel-bone" style={{ height: '12px', width: '40%' }} />
        </div>
      </div>
      <div className="skel-tabs">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skel-tab skel-bone" />
        ))}
      </div>
      <div className="skel-content-rows">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skel-row skel-bone" />
        ))}
      </div>
    </div>
  );
};

/* ── Community Feed Skeleton ── */
export const CommunityFeedSkeleton = () => {
  return (
    <div className="community-skeleton">
      {[1, 2, 3].map(i => (
        <div key={i} className="skel-post">
          <div className="skel-post-header">
            <div className="skel-post-avatar skel-bone" />
            <div className="skel-post-meta">
              <div className="skel-bone" style={{ height: '14px', width: '120px' }} />
              <div className="skel-bone" style={{ height: '10px', width: '80px' }} />
            </div>
          </div>
          <div className="skel-post-body skel-bone" />
          <div className="skel-post-actions">
            <div className="skel-action skel-bone" />
            <div className="skel-action skel-bone" />
            <div className="skel-action skel-bone" />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── Live Classes Skeleton ── */
export const LiveClassesSkeleton = () => {
  return (
    <div className="live-classes-skeleton">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skel-class-card">
          <div className="skel-thumb skel-bone" />
          <div className="skel-class-info">
            <div className="skel-bone" style={{ height: '14px', width: '70%' }} />
            <div className="skel-bone" style={{ height: '10px', width: '45%' }} />
            <div className="skel-bone" style={{ height: '10px', width: '30%' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── Profile Tab Skeleton ── */
export const ProfileTabSkeleton = ({ variant = 'default' }) => {
  if (variant === 'profile') {
    return (
      <div className="profile-tab-skeleton">
        <div className="skel-header skel-bone" />
        <div className="skel-stat-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skel-stat skel-bone" />
          ))}
        </div>
        <div className="skel-block skel-bone" />
      </div>
    );
  }

  if (variant === 'progress') {
    return (
      <div className="profile-tab-skeleton">
        <div className="skel-header skel-bone" />
        <div className="skel-split">
          <div className="skel-bone" style={{ height: '160px', borderRadius: '16px' }} />
          <div className="skel-bone" style={{ height: '160px', borderRadius: '16px' }} />
        </div>
      </div>
    );
  }

  if (variant === 'courses') {
    return (
      <div className="profile-tab-skeleton">
        <div className="skel-header skel-bone" />
        <div className="skel-block skel-bone" />
        <div className="skel-block-sm skel-bone" />
      </div>
    );
  }

  // Default variant for all other tabs
  return (
    <div className="profile-tab-skeleton">
      <div className="skel-header skel-bone" />
      <div className="skel-block-md skel-bone" />
      <div className="skel-block-sm skel-bone" />
      <div className="skel-block-md skel-bone" />
    </div>
  );
};

/* ── Generic Page Skeleton ── */
export const PageSkeleton = ({ rows = 4 }) => {
  return (
    <div className="page-skeleton">
      <div className="skel-bone" style={{ height: '28px', width: '200px', borderRadius: '8px' }} />
      <div className="skel-bone" style={{ height: '14px', width: '300px', borderRadius: '6px' }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skel-bone" style={{ height: '60px', width: '100%', borderRadius: '14px' }} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
