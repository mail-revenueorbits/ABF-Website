const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://icwopbuahkucruezlomp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljd29wYnVhaGt1Y3J1ZXpsb21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTA2MTcsImV4cCI6MjA5NDI4NjYxN30.YXrzvIExSKzlVNQ2DnZ0desvVTdSbLq93UZp4VBrOSo'
);

async function check() {
  const { data } = await supabase.from('products').select('id, images').eq('id', 'C1-01').single();
  const imgs = data.images;
  console.log('Type:', typeof imgs);
  console.log('Is array:', Array.isArray(imgs));
  console.log('Raw value:', JSON.stringify(imgs).substring(0, 500));
  
  // Try to get first URL
  let urls;
  if (typeof imgs === 'string') {
    urls = JSON.parse(imgs);
  } else {
    urls = imgs;
  }
  console.log('\nFirst URL:', urls[0]);
  
  // Test if the URL is accessible
  const https = require('https');
  const url = urls[0];
  console.log('\nTesting URL accessibility...');
  https.get(url, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);
  }).on('error', (err) => {
    console.log('Error:', err.message);
  });
}

check();
