import Tour from 'reactour';

const Tour = ({ steps, isTourOpen, onClose }) => (
  <Tour
    steps={steps}
    isOpen={isTourOpen}
    onRequestClose={onClose}
  />
);

export default Tour;