interface PropRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

interface PropsTableProps {
  props: PropRow[];
}

const PropsTable = ({ props }: PropsTableProps) => (
  <div className="rounded-xl border border-border bg-card p-6">
    <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Props</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Prop</th>
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Type</th>
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Default</th>
            <th className="text-left py-2 font-medium text-muted-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, i) => (
            <tr key={prop.name} className={i % 2 === 1 ? "bg-muted/30" : ""}>
              <td className="py-2 pr-4 font-mono text-primary">{prop.name}</td>
              <td className="py-2 pr-4 text-muted-foreground">{prop.type}</td>
              <td className="py-2 pr-4 font-mono">{prop.default}</td>
              <td className="py-2 text-muted-foreground">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default PropsTable;
