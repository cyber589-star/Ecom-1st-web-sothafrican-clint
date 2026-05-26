'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CleanupPage() {
  const [results, setResults] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  useEffect(() => {
    (async () => {
      const res: Record<string, string> = {}
      for (const [label, table] of Object.entries({ Products: 'products', Categories: 'categories', Orders: 'orders' })) {
        try {
          const { error } = await supabase.from(table).delete().neq('id', 'none')
          res[label] = error ? `Failed: ${error.message}` : 'Cleared'
        } catch (e: any) { res[label] = `Error: ${e.message}` }
      }
      setResults(res)
      setDone(true)
    })()
  }, [])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-lg font-bold text-gray-900 mb-4">System Cleanup</h1>
        {!done ? (
          <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto" />
        ) : (
          <div className="space-y-2 text-left bg-gray-50 rounded-xl p-4">
            {Object.entries(results).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-gray-600">{k}:</span>
                <span className={v === 'Cleared' ? 'text-emerald-600 font-semibold' : 'text-red-600'}>{v}</span>
              </div>
            ))}
            <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-200">
              {results.Orders?.startsWith('Failed') ? '⚠ Orders need the DELETE policy SQL to be run in Supabase dashboard first.' : '✅ All data cleaned. Categories can be seeded at /seed'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
