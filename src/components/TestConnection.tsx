import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient'; // Fixed import path

function TestConnection() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  async function checkConnection() {
    // Query your newly created table (e.g. "test_table")
    const { data, error } = await supabase
      .from('users')  // or whatever table name you used
      .select('*')
      .limit(1);

    if (error) {
      setError(error.message);
      setResult(null);
    } else {
      setError(null);
      setResult(data);
    }
  }

  return (
    <div style={{ margin: '1rem' }}>
      <button onClick={checkConnection}>
        Check Supabase Connection
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>
          Error: {error}
        </p>
      )}
      {result && (
        <pre style={{ marginTop: '1rem' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default TestConnection;
