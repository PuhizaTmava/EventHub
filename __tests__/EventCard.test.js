import renderer from 'react-test-renderer';
import EventCard from '../components/EventCard';

test('EventCard renderohet sakte (snapshot)', () => {
  const event = {
    id: '1',
    title: 'Koncert Test',
    description: 'Nje pershkrim i shkurter',
    distanceKm: 2.3,
  };

  const tree = renderer
    .create(<EventCard event={event} onPress={() => {}} onDelete={() => {}} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
