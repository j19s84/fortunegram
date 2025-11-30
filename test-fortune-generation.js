const http = require('http');

// Test configurations for different oracle types
const testConfigs = [
  {
    oracle: 'the cards',
    persona: 'seeker',
    timeframe: 'present',
    energy: 'balanced'
  },
  {
    oracle: 'the cards',
    persona: 'wanderer',
    timeframe: 'future',
    energy: 'hopeful'
  },
  {
    oracle: 'the stones',
    persona: 'dreamer',
    timeframe: 'past',
    energy: 'reflective'
  },
  {
    oracle: 'the stars',
    persona: 'seeker',
    timeframe: 'future',
    energy: 'anxious'
  },
  {
    oracle: 'the stars',
    persona: 'warrior',
    timeframe: 'present',
    energy: 'determined'
  },
  {
    oracle: 'the numbers',
    persona: 'artist',
    timeframe: 'present',
    energy: 'creative'
  },
  {
    oracle: 'the coins',
    persona: 'leader',
    timeframe: 'future',
    energy: 'uncertain'
  },
  {
    oracle: 'the dream',
    persona: 'mystic',
    timeframe: 'present',
    energy: 'introspective'
  },
  {
    oracle: 'the poets',
    persona: 'wanderer',
    timeframe: 'present',
    energy: 'lost'
  }
];

function makeRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      character: data.persona,
      timeframe: data.timeframe,
      energy: data.energy,
      lens: data.oracle
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/generate-fortune',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'x-forwarded-for': '127.0.0.1'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ data, result: parsed, status: res.statusCode });
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🔮 Testing Fortune Generation System\n');
  console.log('='.repeat(80));

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const config of testConfigs) {
    try {
      const { data, result, status } = await makeRequest(config);

      console.log(`\n📖 Oracle: ${data.oracle.toUpperCase()}`);
      console.log(`   Persona: ${data.persona} | Timeline: ${data.timeframe} | Energy: ${data.energy}`);

      if (status === 200 && result.success) {
        console.log(`   ✓ Success (HTTP ${status})`);
        console.log(`\n   Fortune:\n${result.fortune.split('\n').map(l => '   ' + l).join('\n')}`);

        // Quality checks
        const lineCount = result.fortune.split('\n').filter(l => l.trim()).length;
        const wordCount = result.fortune.split(/\s+/).length;
        const hasLineBreaks = result.fortune.includes('\n');

        console.log(`\n   Quality Metrics:`);
        console.log(`   - Lines: ${lineCount} ${lineCount >= 2 && lineCount <= 3 ? '✓' : '⚠'} (target: 2-3)`);
        console.log(`   - Words: ${wordCount} ${wordCount <= 60 ? '✓' : '⚠'} (target: ≤60)`);
        console.log(`   - Line breaks: ${hasLineBreaks ? '✓' : '⚠'}`);

        passed++;
      } else {
        console.log(`   ✗ Failed (HTTP ${status})`);
        console.log(`   Error: ${result.error || 'Unknown error'}`);
        failed++;
      }

      results.push({ data, result, status });

      // Rate limiting - wait a bit between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(`   ✗ Request failed: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n✨ Test Summary: ${passed} passed, ${failed} failed out of ${testConfigs.length} tests`);
  console.log('\nKey Observations:');
  console.log('1. Oracle-specific tone and voice');
  console.log('2. Format compliance (2-3 sentences, line breaks)');
  console.log('3. Specificity to persona + timeline + energy');
  console.log('4. Immediately recognizable as true/relevant');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
