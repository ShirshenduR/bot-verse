import { Flag, Heart, MessageSquare, Share2 } from "lucide-react";
import { useShareModal } from "@/stores/modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeAndReport } from "@/lib/queries";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";

export function ChatbotCard({
  chatbot,
  queryKeys,
}: {
  chatbot: Chatbot;
  queryKeys: string[];
}) {
  const shareModel = useShareModal();
  const rq = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: likeAndReport,
    onSuccess: () => rq.invalidateQueries({ queryKey: queryKeys }),
  });

  return (
    <Card className="w-full max-w-sm mx-auto h-full">
      <Link to={`/hub/${chatbot.id}`}>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={chatbot.avatar} alt={chatbot.name} />
            <AvatarFallback>
              {chatbot.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{chatbot.name}</h2>
            <p className="text-sm text-muted-foreground">
              Created by @{chatbot.generated_by}
            </p>
          </div>
        </CardHeader>
      </Link>
      <CardContent>
        <p className="text-sm">"{chatbot.prompt.substring(0, 100)}"</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              mutation.mutate({
                action: "like",
                id: chatbot.id,
                type: "chatbot",
              })
            }
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Like</span>
          </Button>
          <span
            className="inline-flex items-center text-sm text-muted-foreground"
            aria-label="Like count"
          >
            {chatbot.likes}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              mutation.mutate({
                action: "report",
                id: chatbot.id,
                type: "chatbot",
              })
            }
          >
            <Flag className="h-4 w-4" />
            <span className="sr-only">Report</span>
          </Button>
          <span
            className="inline-flex items-center text-sm text-muted-foreground"
            aria-label="Like count"
          >
            {chatbot.reports}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => navigate(`/chatbot/${chatbot.id}`)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              shareModel.onOpen({
                title: `Share Chatbot ${chatbot.name} Powered by Bot Verse`,
                shareUrl: `http://localhost:5000/hub/${chatbot.id}`,
              })
            }
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
