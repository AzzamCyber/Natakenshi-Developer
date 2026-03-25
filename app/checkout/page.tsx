import payments from "@/data/payments.json"

export default function Checkout() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {payments.map((method: any, i: number) => (
        <div key={i} className="mb-3">
          <p>{method.name}</p>
          <p className="text-blue-400">{method.number}</p>
        </div>
      ))}
    </div>
  )
}