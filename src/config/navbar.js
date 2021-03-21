import {
  Album,
  Explore,
  Folder,
  Genre,
  Heart,
  Microphone,
  Play,
  Search,
  Song,
  Wave,
} from '../components/icons';
import { ExplorePage, FolderPage, SearchPage, SongPage } from '../contents';

let browse = [
  {
    name: 'Explore',
    icon: Explore,
    component: ExplorePage,
  },
  {
    name: 'Search',
    icon: Search,
    component: SearchPage,
  },
  {
    name: 'All Song',
    icon: Song,
    component: SongPage,
  },
  {
    name: 'Now Playing',
    icon: Play,
  },
  {
    name: 'Album',
    icon: Album,
  },
  {
    name: 'Artist',
    icon: Microphone,
  },
  {
    name: 'Genre',
    icon: Genre,
  },
  {
    name: 'Folder',
    icon: Folder,
    component: FolderPage,
  },
  {
    name: 'Recently Played',
    icon: Wave,
  },
  {
    name: 'Most Played',
    icon: Wave,
  },
  {
    name: 'Favorite',
    icon: Heart,
  },
];

export default browse;
