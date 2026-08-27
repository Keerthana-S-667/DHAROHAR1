/**
 * 3D Model service wrapper (Placeholder for future image-to-3D service or model loading).
 */
export const threeDService = {
  /**
   * Returns metadata/URI for a 3D model file based on monument ID.
   */
  async getModelUrl(monumentId: string): Promise<string | null> {
    console.log(`Resolving 3D asset URL for monument:`, monumentId);
    
    // For now, return a placeholder path or mock indicator
    if (monumentId === 'shore-temple') {
      return '/assets/models/shore-temple.gltf';
    }
    return null;
  }
};
