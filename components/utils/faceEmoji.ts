const FACE_EMOJIS = [
    '🦐', '🦔', '🥶', '👹', '👻', '🦭', '🐙', '🗿', '🦖', '🦘', '🦦', '⛄️'
];

// Pick a random face emoji. Call this on the client (after mount) so a fresh
// face is chosen on every visit without causing an SSG hydration mismatch.
export function randomFaceEmoji(): string {
    return FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)];
}
