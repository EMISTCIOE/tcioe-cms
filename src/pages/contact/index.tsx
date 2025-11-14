import { lazy } from 'react';

// LAZY COMPONENT IMPORTS
const PhoneNumberListing = lazy(() => import('../../pages/contact/components/listing'));

const Contact = () => {
  return (
    <>
      <PhoneNumberListing />
    </>
  );
};

export default Contact;
