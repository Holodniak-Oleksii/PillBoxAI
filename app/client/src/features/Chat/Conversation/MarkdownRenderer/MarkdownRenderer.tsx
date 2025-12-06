import { Box, Text } from "@chakra-ui/react";
import { FC, JSX, useMemo } from "react";

interface IMarkdownRendererProps {
  content: string;
  color?: string;
}

export const MarkdownRenderer: FC<IMarkdownRendererProps> = ({
  content,
  color = "inherit",
}) => {
  const renderedContent = useMemo(() => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let key = 0;
    let inList = false;

    const processInlineMarkdown = (text: string): JSX.Element[] => {
      const parts: JSX.Element[] = [];
      let partKey = 0;

      const boldRegex = /(\*\*|__)(.*?)\1/g;
      const boldMatches: Array<{ start: number; end: number; text: string }> =
        [];
      let match;

      while ((match = boldRegex.exec(text)) !== null) {
        boldMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[2],
        });
      }

      if (boldMatches.length > 0) {
        let lastIndex = 0;
        boldMatches.forEach((boldMatch) => {
          if (boldMatch.start > lastIndex) {
            parts.push(
              <span key={partKey++}>
                {text.substring(lastIndex, boldMatch.start)}
              </span>
            );
          }
          parts.push(
            <Text key={partKey++} as="span" fontWeight="bold">
              {boldMatch.text}
            </Text>
          );
          lastIndex = boldMatch.end;
        });
        if (lastIndex < text.length) {
          parts.push(<span key={partKey++}>{text.substring(lastIndex)}</span>);
        }
      } else {
        parts.push(<span key={partKey++}>{text}</span>);
      }

      return parts;
    };

    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        if (inList) {
          inList = false;
        }
        elements.push(<br key={key++} />);
        return;
      }

      if (trimmedLine.startsWith("# ")) {
        if (inList) inList = false;
        elements.push(
          <Text
            key={key++}
            as="h1"
            fontSize="xl"
            fontWeight="bold"
            mb={2}
            mt={lineIndex > 0 ? 2 : 0}
            color={color}
          >
            {processInlineMarkdown(trimmedLine.substring(2))}
          </Text>
        );
        return;
      }
      if (trimmedLine.startsWith("## ")) {
        if (inList) inList = false;
        elements.push(
          <Text
            key={key++}
            as="h2"
            fontSize="lg"
            fontWeight="bold"
            mb={2}
            mt={lineIndex > 0 ? 2 : 0}
            color={color}
          >
            {processInlineMarkdown(trimmedLine.substring(3))}
          </Text>
        );
        return;
      }
      if (trimmedLine.startsWith("### ")) {
        if (inList) inList = false;
        elements.push(
          <Text
            key={key++}
            as="h3"
            fontSize="md"
            fontWeight="bold"
            mb={1}
            mt={lineIndex > 0 ? 1 : 0}
            color={color}
          >
            {processInlineMarkdown(trimmedLine.substring(4))}
          </Text>
        );
        return;
      }

      if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        if (!inList && lineIndex > 0) {
          elements.push(<Box key={key++} as="ul" ml={4} mb={1} />);
        }
        inList = true;
        elements.push(
          <Text
            key={key++}
            as="li"
            ml={4}
            mb={1}
            color={color}
            display="list-item"
          >
            {processInlineMarkdown(trimmedLine.substring(2))}
          </Text>
        );
        return;
      }

      if (inList) {
        inList = false;
      }
      elements.push(
        <Text key={key++} mb={1} color={color} whiteSpace="pre-wrap">
          {processInlineMarkdown(trimmedLine)}
        </Text>
      );
    });

    return elements;
  }, [content, color]);

  return <Box>{renderedContent}</Box>;
};
