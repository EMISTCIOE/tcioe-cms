import React from 'react';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import MyUnitProfile from './components/MyUnitProfile';
import MySectionProfile from './components/MySectionProfile';

const MyUnitPage = () => {
  const authData = useAppSelector(authState);
  const { roleType, campusUnitId, campusSectionId } = authData;

  console.log('MyUnitPage - Full Auth Debug:', authData);

  // Render different components based on role type
  if (roleType === 'CAMPUS-UNIT' && campusUnitId) {
    return <MyUnitProfile />;
  }

  if (roleType === 'CAMPUS-SECTION' && campusSectionId) {
    return <MySectionProfile />;
  }

  // Show detailed error for debugging
  return (
    <div style={{ padding: '20px' }}>
      <h1>Access Information</h1>
      <p>
        <strong>Role Type:</strong> {roleType || 'Not set'}
      </p>
      <p>
        <strong>Campus Unit ID:</strong> {campusUnitId || 'Not set'}
      </p>
      <p>
        <strong>Campus Section ID:</strong> {campusSectionId || 'Not set'}
      </p>
      <p>
        <strong>Expected:</strong> CAMPUS-UNIT with unitId OR CAMPUS-SECTION with sectionId
      </p>
      {!roleType && <p style={{ color: 'red' }}>No role type found in auth state</p>}
      {roleType === 'CAMPUS-SECTION' && !campusSectionId && <p style={{ color: 'red' }}>Section role but no section ID</p>}
      {roleType === 'CAMPUS-UNIT' && !campusUnitId && <p style={{ color: 'red' }}>Unit role but no unit ID</p>}
    </div>
  );
};

export default MyUnitPage;
