import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, Star } from "lucide-react";
import type { BrewRecord } from "@/types/brew";

interface Props {
  brews: BrewRecord[];
  onDelete: (id: string) => void;
}

export const BrewHistory = ({ brews, onDelete }: Props) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Brew History</CardTitle>
      </CardHeader>
      <CardContent>
        {brews.length === 0 ? (
          <p className="text-muted-foreground">No brews yet. Log your first one!</p>
        ) : (
          <ScrollArea className="h-[420px] pr-2">
            <ul className="space-y-4">
              {brews.map((b) => (
                <li key={b.id} className="rounded-md border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{new Date(b.dateISO).toLocaleString()}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span>{b.method}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span>{b.ratio}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span>{b.timeSec}s</span>
                      </div>
                      <div className="mt-1 font-medium">
                        {b.beans ?? "Beans not specified"}
                      </div>
                      {b.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">{b.notes}</p>
                      )}
                      {b.rating && (
                        <div className="mt-2 inline-flex items-center gap-1 text-accent">
                          {Array.from({ length: b.rating }).map((_, i) => (
                            <Star key={i} className="size-4 fill-current" />
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" onClick={() => onDelete(b.id)} aria-label="Delete brew">
                      <Trash2 />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
