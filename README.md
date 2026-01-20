# ITパスポート略語学習サービス (IT_passport_keyword)

ITパスポートの略語勉強のための学習サービスです。

## Future Roadmap

### v1.1 - 2026 Q1
- **カテゴリ別全問出題モード**
  - ストラテジ系、テクノロジ系などのカテゴリを選択可能にする
  - 選択したカテゴリの問題を**全て**出題する（10問制限の撤廃）
  - 隙間時間で1カテゴリを完了できるようにし、学習の達成感を高める
- **単語カードモード**
  - "Network", "Resource" などの頻出単語を単体で学習するモード
  - 丸暗記から脱却し、単語の意味を理解して組み立てられるようにする

### v1.0 (Current)
- 単語並べ替えクイズ（Word Shuffle Quiz）の実装
- ランダム10問出題
- 正式名称の空白埋め形式により英語理解を深める


## Development

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Dockerでの起動方法 (Recommended for collaboration)

Docker環境がある場合は、以下のコマンドだけで開発環境を起動できます。

```bash
docker compose up
```

- Windows環境との互換性が高まります。
- 終了するには `Ctrl+C` を押してください。

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
