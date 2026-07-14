import { Service, GalleryItem } from './types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Traditional South Indian Bridal',
    category: 'Bridal',
    description: 'Flawless, long-lasting traditional makeup tailored to perfectly complement heavy silk sarees, jasmine flowers, and heritage temple jewelry.',
    fromPrice: 25000,
    duration: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdQcZ9Kwnvg7AcCLMYlwkccLTLlra3Tplc0Ult0F6eN2ueqyJMumaalxT-wFMNb5qsS-wqcG0C41-n05VEikckvmCKMGTRBke70f0-fnkejbvMtyeuCEfB4P6uzznzEsMVv-9futo01FFicYemJUUfXeufoLNm-kOZM9Xnt1NgDC0RizrV5vIFlyVOafeogJEfK5TFt056MwFyXgfZTWXM2Z_obREgqGsYtI_0-MVwlB3n_TdDvxrsOc-ROD-IgXZV6oNFcNo_dKM'
  },
  {
    id: 's2',
    name: 'Grand Reception Glamour',
    category: 'Reception',
    description: 'Glamorous and glowing makeup and styling for your reception. Features elegant contouring, flawless skin, and a striking, sophisticated lip.',
    fromPrice: 15000,
    duration: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1W3Of_IOjEQko6s-SaxKOCRA1WXuHimMAqKMDy_QM4JTPFKhZqZdzQdwOqaZo-kVUo2QvttbqSYj4dgY4oogfcaBJMoi2AasWJjI2NUvze_vmglsrRrtczRU52RpBYetlhZ9VlsuDULmmkWP7Ptr5Zrce4dA6vFiuew8i-JpLCte2CB1A7Xb5wJyu1pALPY7COQKy6hJWT68XgsPO49DoTQM2FjLKiXoBWhnIYbISg-cc9FbjKhuuGXrCkuSW4-60L-fNUl4eddI'
  },
  {
    id: 's3',
    name: 'Baby Shower (Seemantham)',
    category: 'Baby Shower',
    description: 'Serene and natural traditional makeup with a festive glow, celebrating your beautiful milestones with pure comfort and joy.',
    fromPrice: 12000,
    duration: 1.5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuSujyyqonzR7TjBzRpLV6qcvg_7YpfVg1v9Hv02qcQXCE5zSTkD6HEQMP-eteQ3Od07Vrv8kQb0awE7OF41EAZovXI-i-uqKFdr1jEVGlatMMnXz7LexqfNC3oURUOBJmb7FWmLjXkDklsc_TK6jxhSwKj87Fre7702pgAkCQuoCmWE-CwvEi0dfZ4PG-CAOOPqi_Mju5JUvnxQMyBrrKGLBHEJX21mGK1Y8dAp6LrnPZTk0kQwmNG6qce0nx3CZXq-reitKPpq4'
  },
  {
    id: 's4',
    name: 'Home Function & Festive Party',
    category: 'Party',
    description: 'Delicate, understated makeup and draping, perfect for warm family gatherings, puja functions, and light evening celebrations.',
    fromPrice: 8000,
    duration: 1.5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCek9iZBG1X-uwMcmPf2gP59ZmpnU1UITktUdDA8nrNOMX0rSjgTUZPkmwPDBbOt-vP2-Uwc3HxYIuvagXUpA6faV1v8bEiK2KHE-b8oFzDD81DYESHmI3wR6YbSAqKmuKwZtUtPA3DAit8FitTOH6fgiqQmQ99EQAd_xAdiZofith5fz1DaAy-LG1_omEW1hJUazHFZusVX2bnxdpjjGdzm0oHS8f50Wkwi7tjoVAH0nz4TReI2XiJITUEFrHOySldGwjCks8sCI8'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdlfdLV4cNVz9MeBLmLxgafH83dHYJB1C5VZiHa8HlEJ_PnrBW8065LlGwc9GmKrWqUxZI0MefPKndXR_HEOKji_sk-zRTXc60bibbYkqZnk0ClrFB0N3sxqYvAcbQwxDTUPutuIjTfJErUEu3NRm-K7MddsZ8ua59HcMwYCeCeDO9wY1bJRfP-KY1LV0LpbKcog4kRYOoC1jN0zHYVOtg-i-p48Idne-KTUhsAeqI_d6uglYjumSSvEVE-DLfXnnbh21_jGeLY-4',
    category: 'Shoots',
    title: 'Vogue Editorial Shoot'
  },
  {
    id: 'g2',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTCMpyVVNpVjookXYRwa2L4mexjsfyIMpMDPiM-4vuV6dLDEYvE9r-1rhNZRSUJqnFhn94JV5j6wJRRKtAwUetTvgk8Ek3LUOMpyliZE35VzSaRYV_gMZ65VAqaPdHrCL6uJYRIc13ALDwDIfJoBAZQq-aLYLdOjFt9J9V31a3MaDkwVm0eeVZK08MCWYaBBaEsiCH-Lf02MHXRDd74fDnhCgdAIf2BAz-AtEruvN4BJ3O_Wy36O24rSel9F0SLj478Y_4Hqew5HI',
    category: 'Bridal',
    title: 'Bridal Transformation'
  },
  {
    id: 'g3',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAWbou40omSL3nIhx-sojzpTFSextXur6ZPGEkU9__j41IhGBQ4tnqil7WAsqRsc7-ZahvzO_BR-y1AHaeHalzDDW4Q0i4btswFOtTwnzkhLWG4t4_FL7t_3temUuQJ4Kv2rZLwj5PE3TqqT5DgcbHAW-I1mdQLtAmf8JzD7o634t6VBYMPEWUm-OuHhJrXVNBMQkcxD6doVFfHmiWdt7pJnrNqoNhvtf3WbjBlQu-8gICXlmoevkRWDVA2A182fNYRfDdah8-QGM',
    category: 'Celebrity',
    title: 'Red Carpet Celebrity Glam'
  },
  {
    id: 'g4',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfVs0T08IT8AYy7rbvNvJX97lgwnYI649btCxDWa45ZTybVBNspsfDANwpGnQf6L8Mt8iYLAb6rH5u0UPQ6P4Lzfz7OItAqO4rzN6qhE8ZfdaZXC3zJ1k_4RMm-DwIQNLtYhOGLJeBtCsQdpBsPCpzQULqBPS_xVk2DGehVJaoBR5C6G3WACeKcHpkPZ30hoPNRqdvIcblHRhWj_jAXPl4sl6pCN2JmOan28QM-pMm4YCD3UHxoGU_NvGU-wWTQj0MwPbKaeoXKw8',
    category: 'Shoots',
    title: 'Avant Garde Metallic Portrait'
  },
  {
    id: 'g5',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARXL_9lAHS7Sz1o8Bbm0YrVlGsRYv-XwAb1Cl3J2nKr2UoPeCDheKeAI_22VBkXYa7tpXoVXjOdh3yH3wKp9A5jydhZZKkPpS3GtEdenZ-neh96B0YqJ17ABIAKOtBjPY4PZq2pcbpTuoRCHBLDnq_6W75_K_GlcpEVEGWByQ1PqrPDCYom-w0mVv_0MAZCPqoFxJL4Azl4wDWMnb3DEG3-hVknDGNEbHK-5b5a-DsBCZMhf2bquLtrgEkyR5oLYjK6F_jw-DmQcc',
    category: 'Bridal',
    title: 'Classic Serenity Bride'
  },
  {
    id: 'g6',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP6W_0a4aeGKvIj81WFQj_96NwS858OEgymk7u0RVupKHSIqDiUg1xa_0bDHBA9PPwuTfJ2MZWSi33E0FC8RiGgiAzlHnL9ar4DOE1VLnbDX0nwmGQCMHLYQChD-TnZ9AOSQoP8eZ0W6j2_oxBeA5-raI8MJX_s7WseWe2j_6-HJC8g5Bu-rorHKCZS6UO2-kQ8CgGOGifJPrDnqPKXPcitn423s66giB6cZ6K4_6fpiBh3xIPSpj2u0HZPfwFfU_b-WBAZr_J0hE',
    category: 'Editorial',
    title: 'Metallic Eye Precision'
  }
];
