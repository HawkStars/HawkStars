import type { UIField } from 'payload';

type GeocodeButtonArgs = {
  /** Sibling field holding the address text to look up. Defaults to `address`. */
  sourceField?: string;
  /** Sibling latitude field name. Defaults to `latitude`. */
  latField?: string;
  /** Sibling longitude field name. Defaults to `longitude`. */
  lngField?: string;
  /** Field name, only needed if a group already has a `geocode` field. */
  name?: string;
};

/**
 * Admin-only "Find coordinates" control.
 *
 * Drop it into any field group that stores a latitude/longitude pair next to a
 * human-entered address. It resolves its sibling fields by name relative to its
 * own path, so it works inside blocks and nested arrays without extra wiring.
 *
 * Backed by `/api/geocode`, a server-side Nominatim proxy — see that handler for
 * the OpenStreetMap usage-policy constraints.
 */
export const geocodeButton = ({
  sourceField = 'address',
  latField = 'latitude',
  lngField = 'longitude',
  name = 'geocode',
}: GeocodeButtonArgs = {}): UIField => ({
  name,
  type: 'ui',
  admin: {
    components: {
      Field: {
        path: '@/payload/components/admin/GeocodeField',
        clientProps: { sourceField, latField, lngField },
      },
    },
  },
});

export default geocodeButton;
