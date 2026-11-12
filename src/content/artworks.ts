export interface ArtworkPlate {
  id: string;
  title: string;
  imagePath: string;
  altText: string;
  unlockEpisodeId: string;
}

// Artwork/topic matching follows existing captions and remains for group confirmation.
export const artworks: ArtworkPlate[] = [
  { id: 'bloch', title: 'The Bloch sphere', imagePath: '/gallery/bloch-sphere.svg', altText: 'A sphere diagram representing pure qubit states, with the zero and one basis states at opposite poles.', unlockEpisodeId: 'the-magic-box' },
  { id: 'entangled', title: 'An entangled pair', imagePath: '/gallery/entangled-pair.svg', altText: 'A diagram of two qubits represented together as an entangled pair.', unlockEpisodeId: 'spooky-twins-no-messages' },
  { id: 'crt', title: 'Qubi, the qubit terminal', imagePath: '/gallery/qubi-crt.svg', altText: 'Qubi, a friendly robot designed as a retro CRT monitor.', unlockEpisodeId: 'the-magic-box' },
  { id: 'interference', title: 'Interference', imagePath: '/gallery/interference.svg', altText: 'A visual representation of quantum amplitudes adding and cancelling.', unlockEpisodeId: 'the-magic-box' },
  { id: 'lattice', title: 'The surface code', imagePath: '/gallery/error-correction.svg', altText: 'A lattice diagram representing a quantum surface code.', unlockEpisodeId: 'the-game-show-that-broke-reality' },
  { id: 'photon-key', title: 'Photons carrying a key', imagePath: '/gallery/photon-key.svg', altText: 'A diagram of polarized photons used to represent a quantum key distribution protocol.', unlockEpisodeId: 'spooky-twins-no-messages' },
];
