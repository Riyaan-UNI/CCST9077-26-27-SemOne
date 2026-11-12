export interface ArtworkPlate {
  id: string;
  title: string;
  imagePath: string;
  altText: string;
  /** Omit to keep an editorial / concept-art plate always visible. */
  unlockEpisodeId?: string;
}

// The user reports that the team reviewed the current project content for accuracy.
export const artworks: ArtworkPlate[] = [
  { id: 'unfiled-singularity', title: 'The Unfiled Singularity', imagePath: '/gallery/unfiled-singularity.svg', altText: 'An original cosmic comic-book illustration of a black hole bending starlight, an incoming astronaut stretched toward it, branching green and gold timeline strands, and a tiny Qubi-like archive terminal amid fictional redacted secrets in the dark center.' },
  { id: 'bloch', title: 'The Bloch sphere', imagePath: '/gallery/bloch-sphere.svg', altText: 'A sphere diagram representing pure qubit states, with the zero and one basis states at opposite poles.', unlockEpisodeId: 'the-magic-box' },
  { id: 'entangled', title: 'An entangled pair', imagePath: '/gallery/entangled-pair.svg', altText: 'A diagram of two qubits represented together as an entangled pair.', unlockEpisodeId: 'spooky-twins-no-messages' },
  { id: 'crt', title: 'Qubi, the qubit terminal', imagePath: '/gallery/qubi-crt.svg', altText: 'Qubi, a friendly robot designed as a retro CRT monitor.', unlockEpisodeId: 'the-magic-box' },
  { id: 'interference', title: 'Interference', imagePath: '/gallery/interference.svg', altText: 'A visual representation of quantum amplitudes adding and cancelling.', unlockEpisodeId: 'the-magic-box' },
  { id: 'lattice', title: 'The surface code', imagePath: '/gallery/error-correction.svg', altText: 'A lattice diagram representing a quantum surface code.', unlockEpisodeId: 'the-game-show-that-broke-reality' },
  { id: 'photon-key', title: 'Photons carrying a key', imagePath: '/gallery/photon-key.svg', altText: 'A diagram of polarized photons used to represent a quantum key distribution protocol.', unlockEpisodeId: 'spooky-twins-no-messages' },
];
