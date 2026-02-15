import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useResumeStore } from '@/hooks/useResumeStore';

export default function ApiKeySettings() {
  const [showKey, setShowKey] = useState(false);

  const settings = useResumeStore((s) => s.settings);
  const updateSettings = useResumeStore((s) => s.updateSettings);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">OpenAI Configuration</CardTitle>
        <CardDescription>
          Configure your OpenAI API key and model for AI-powered resume matching.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* API Key */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              API Key
            </label>
            <div className="flex gap-2">
              <Input
                type={showKey ? 'text' : 'password'}
                value={settings.openaiApiKey}
                onChange={(e) =>
                  updateSettings({ openaiApiKey: e.target.value })
                }
                placeholder="sk-..."
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Model
            </label>
            <Input
              type="text"
              value={settings.openaiModel}
              onChange={(e) =>
                updateSettings({ openaiModel: e.target.value })
              }
              placeholder="gpt-4o-mini"
            />
            <p className="text-xs text-muted-foreground">
              The OpenAI model to use for analysis. Default: gpt-4o-mini
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
