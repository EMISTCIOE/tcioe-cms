import { combineReducers } from '@reduxjs/toolkit';
import { rootAPI } from './apiSlice';

// Project Imports
import accountReducer from '@/pages/account/redux/auth.slice';
import authReducer from '@/pages/authentication/redux/auth.slice';
import commonReducer from '@/pages/common/redux/common.slice';
import noticeReducer from '@/pages/notice/redux/notice.slice';
import userRoleReducer from '@/pages/user-role/redux/user-role.slice';
import userReducer from '@/pages/user/redux/user.slice';
import campusKeyOfficailsReducer from '@/pages/website-setup/campus-key-officials/redux/campusKeyOfficials.slice';
import campusFeedbacksReducer from '@/pages/website-setup/campus-feedbacks/redux/campusFeedbacks.slice';
import campusEventsReducer from '@/pages/website-setup/campus-events/redux/campusEvents.slice';
import CampusUnionsReducer from '@/pages/website-setup/campus-unions/redux/campusUnions.slice';
import AcademicCalendersReducer from '@/pages/website-setup/academic-calendars/redux/academicCalendars.slice';
import campusDownloadsReducer from '@/pages/website-setup/campus-downloads/redux/campusDownloads.slice';
import StudentClubsReducer from '@/pages/student-clubs-setup/student-clubs/redux/studentClubs.slice';

export const rootReducer = combineReducers({
  common: commonReducer,
  auth: authReducer,
  account: accountReducer,
  user: userReducer,
  userRole: userRoleReducer,
  notice: noticeReducer,
  campusKeyOfficials: campusKeyOfficailsReducer,
  campusFeedbacks: campusFeedbacksReducer,
  campusEvents: campusEventsReducer,
  campusUnions: CampusUnionsReducer,
  academicCalendars: AcademicCalendersReducer,
  campusDownloads: campusDownloadsReducer,
  studentClubs: StudentClubsReducer,
  // add reducers here
  [rootAPI.reducerPath]: rootAPI.reducer
});
