// import { Payload } from 'payload';

// export const seed = async (payload: Payload): Promise<void> => {
//   try {
//     await payload.updateGlobal({
//       slug: 'header',
//       data: {
//         columns: [
//           {
//             id: 'test',
//             data: {
//               key: 'main',
//               links: [
//                 { link: { appearance: 'default', label: 'Test 1', type: 'custom', url: '/' } },
//               ],
//             },
//           },
//           {
//             id: 'test',
//             data: {
//               key: 'main',
//               links: [
//                 { link: { appearance: 'default', label: 'Test 1', type: 'custom', url: '/' } },
//               ],
//             },
//           },
//           {
//             id: 'test',
//             data: {
//               key: 'main',
//               links: [
//                 { link: { appearance: 'default', label: 'Test 1', type: 'custom', url: '/' } },
//               ],
//             },
//           },
//           {
//             id: 'test',
//             data: {
//               key: 'main',
//               links: [
//                 { link: { appearance: 'default', label: 'Test 1', type: 'custom', url: '/' } },
//               ],
//             },
//           },
//           {
//             id: 'test',
//             data: {
//               key: 'main',
//               links: [
//                 { link: { appearance: 'default', label: 'Test 1', type: 'custom', url: '/' } },
//               ],
//             },
//           },
//         ],
//       },
//     });
//     console.log('✅ Header seeded successfully');

//     await payload.updateGlobal({
//       slug: 'footer',
//       data: {
//         columns: [
//           {
//             id: 'test',
//             column: {
//               title: 'main',
//               data: [
//                 { link: { appearance: 'default', label: 'Test 1', type: 'custom', url: '/' } },
//               ],
//             },
//           },
//         ],
//       },
//     });
//     console.log('✅ Footer seeded successfully');
//   } catch (error) {
//     console.error('❌ Error creating demo page:', error);
//   }
// };
