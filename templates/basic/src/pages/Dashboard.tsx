import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    return (
        <>
            {/* <PageHeader>
                <PageHeaderHeading>Dashboard</PageHeaderHeading>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>React Shadcn Starter</CardTitle>
                    <CardDescription>React + Vite + TypeScript template for building apps with shadcn/ui.</CardDescription>
                </CardHeader>
            </Card> */}
            <ChatMessageList>
                <ChatBubble>
                <ChatBubbleAvatar />
                <ChatBubbleMessage>
                    Message and other content here
                </ChatBubbleMessage>
                </ChatBubble>
            </ChatMessageList>
            <div className="flex-1" />
            <ChatInput
                placeholder="Type your message here..."
            />
            <Button
                size="sm" className="ml-auto gap-1.5">
                Send Message
                {/* <CornerDownLeft className="size-3.5" /> */}
            </Button>
            </>
        
    )
}
