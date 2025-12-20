import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PricingSection } from "@/components/pricing-section"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { FadeIn } from "@/components/ui/fade-in"
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects"

export const metadata: Metadata = {
    title: "Giới thiệu - Clarify",
    description:
        "Nền tảng AI chuyển văn bản thành sơ đồ. Tạo diagram draw.io nhanh từ prompt.",
    keywords: [
        "AI sơ đồ",
        "text to diagram",
        "draw.io",
        "kiến trúc hệ thống",
        "workflow",
        "diagram SaaS",
    ],
}

function formatNumber(num: number): string {
    if (num >= 1000) {
        return `${num / 1000}k`
    }
    return num.toString()
}

export default function AboutVI() {
    const dailyRequestLimit = Number(process.env.DAILY_REQUEST_LIMIT) || 20
    const dailyTokenLimit = Number(process.env.DAILY_TOKEN_LIMIT) || 500000
    const tpmLimit = Number(process.env.TPM_LIMIT) || 50000

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight"
                    >
                        Clarify
                    </Link>
                    <nav className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        <Link
                            href="/"
                            className="transition hover:text-foreground"
                        >
                            Trình chỉnh sửa
                        </Link>
                        <Link href="/about/vi" className="text-foreground">
                            Giới thiệu
                        </Link>
                        {/* <a
                            href="https://github.com/DayuanJiang/next-ai-draw-io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 border border-border bg-card px-3 py-2 text-foreground transition hover:-translate-y-0.5 hover:bg-secondary"
                            aria-label="Xem trên GitHub"
                        >
                            <FaGithub className="h-4 w-4" />
                            GitHub
                        </a> */}
                    </nav>
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        <Link
                            href="/about"
                            className="transition hover:text-foreground"
                        >
                            English
                        </Link>
                        <span className="text-muted-foreground/40">|</span>
                        <Link href="/about/vi" className="text-foreground">
                            Tiếng Việt
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
                <section className="relative left-1/2 right-1/2 mt-10 w-screen -translate-x-1/2 border-y border-border overflow-hidden">
                    <AnimatedGridPattern
                        numSquares={30}
                        maxOpacity={0.1}
                        duration={3}
                        repeatDelay={1}
                        className={
                            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 fill-black/[0.02] stroke-black/5 dark:fill-white/[0.02] dark:stroke-white/5"
                        }
                    />
                    <div className="relative mx-auto grid max-w-[1400px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
                        <FadeIn>
                            <div className="flex items-center gap-3">
                                <span className="h-1 w-8 bg-chart-3" />
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                                    AI tạo sơ đồ từ văn bản
                                </p>
                            </div>
                            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                                Tạo sơ đồ đúng như cách bạn mô tả hệ thống.
                            </h1>
                            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                                Biến ngôn ngữ tự nhiên thành sơ đồ draw.io chính
                                xác. Phác thảo kiến trúc, quy trình và luồng dữ
                                liệu chỉ với một prompt, rồi tinh chỉnh bằng
                                chat.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center rounded-md border border-primary bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl"
                                >
                                    Mở trình chỉnh sửa
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center border border-border bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-secondary/80"
                                >
                                    Thử một prompt
                                </Link>
                            </div>
                            <FadeIn
                                delay={0.2}
                                className="mt-8 grid gap-4 sm:grid-cols-3"
                            >
                                <div className="border border-border bg-chart-1/10 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Tốc độ phác thảo
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold">
                                        Vài phút
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        từ prompt đến sơ đồ
                                    </p>
                                </div>
                                <div className="border border-border bg-chart-2/10 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Nhà cung cấp
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold">
                                        8+ mô hình
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        tự mang khóa API
                                    </p>
                                </div>
                                <div className="border border-border bg-chart-3/10 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Đầu ra
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold">
                                        Draw.io XML
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        sẵn sàng xuất
                                    </p>
                                </div>
                            </FadeIn>
                        </FadeIn>
                        <FadeIn delay={0.3} className="grid gap-4">
                            <div className="border border-border bg-secondary p-4">
                                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                    <span>Prompt trực tiếp</span>
                                    <span className="text-foreground">
                                        AI + draw.io
                                    </span>
                                </div>
                                <p className="mt-4 border border-border bg-card p-4 text-sm text-muted-foreground">
                                    Xây dựng kiến trúc AWS với web client, API
                                    gateway, workers và data lake. Thêm
                                    connector động cho luồng nạp dữ liệu.
                                </p>
                                <div className="mt-4 border border-border bg-card">
                                    <Image
                                        src="/aws_demo.svg"
                                        alt="Sơ đồ kiến trúc AWS do AI tạo"
                                        width={520}
                                        height={360}
                                        className="h-auto w-full"
                                        priority
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="border border-border border-t-4 border-t-chart-2 bg-card p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Vòng lặp chỉnh sửa
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Chat để chỉnh bố cục, nhãn và connector
                                        mà không cần chạm vào XML.
                                    </p>
                                </div>
                                <div className="border border-border border-t-4 border-t-chart-4 bg-card p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Lịch sử
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Khôi phục bất kỳ phiên bản trước nào
                                        trong vài giây.
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                <section className="mt-16">
                    <FadeIn>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-3xl font-semibold">
                                    Dành cho người tư duy hệ thống.
                                </h2>
                                <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                                    Biến kế hoạch sản phẩm và kiến trúc thành
                                    tài liệu mà đội ngũ có thể triển khai ngay.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                <span className="border border-border bg-chart-1/15 px-3 py-1 text-foreground">
                                    Mã nguồn mở
                                </span>
                                <span className="border border-border bg-chart-2/15 px-3 py-1 text-foreground">
                                    Sẵn sàng tự triển khai
                                </span>
                                <span className="border border-border bg-chart-3/15 px-3 py-1 text-foreground">
                                    Chuẩn draw.io
                                </span>
                            </div>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.2} className="mt-8">
                        <FeaturesSectionWithHoverEffects />
                    </FadeIn>
                </section>

                <section className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <FadeIn className="h-full">
                        <div className="h-full border border-border border-t-4 border-t-chart-4 bg-card p-8">
                            <h2 className="text-2xl font-semibold">
                                Cách hoạt động
                            </h2>
                            <div className="mt-6 space-y-5">
                                <div className="flex items-start gap-4">
                                    <span className="flex h-10 w-10 items-center justify-center border border-border bg-primary text-sm font-semibold text-primary-foreground">
                                        1
                                    </span>
                                    <div>
                                        <h3 className="text-base font-semibold">
                                            Mô tả kết quả mong muốn
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Bắt đầu với một prompt hoặc tải lên
                                            ảnh sơ đồ.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="flex h-10 w-10 items-center justify-center border border-border bg-primary text-sm font-semibold text-primary-foreground">
                                        2
                                    </span>
                                    <div>
                                        <h3 className="text-base font-semibold">
                                            AI phác thảo sơ đồ
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Tạo XML draw.io, icon và bố cục ngay
                                            lập tức.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="flex h-10 w-10 items-center justify-center border border-border bg-primary text-sm font-semibold text-primary-foreground">
                                        3
                                    </span>
                                    <div>
                                        <h3 className="text-base font-semibold">
                                            Tinh chỉnh và xuất
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Dùng chat để chỉnh, rồi xuất SVG,
                                            PNG hoặc file draw.io.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.2} className="h-full">
                        <div className="h-full border border-border border-t-4 border-t-chart-5 bg-card p-8">
                            <h2 className="text-2xl font-semibold">
                                Điểm nổi bật
                            </h2>
                            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                                <li>
                                    Tạo và chỉnh sửa sơ đồ bằng LLM với prompt
                                    ngôn ngữ tự nhiên.
                                </li>
                                <li>
                                    Nhân bản và cải thiện sơ đồ từ ảnh để xử lý
                                    luồng cũ.
                                </li>
                                <li>
                                    Giao diện chat tương tác để kiểm soát bố cục
                                    chính xác.
                                </li>
                                <li>
                                    Connector động cho storytelling luồng dữ
                                    liệu.
                                </li>
                                <li>
                                    Hỗ trợ nhiều nhà cung cấp gồm AWS Bedrock,
                                    OpenAI, Anthropic, Google AI, Azure OpenAI,
                                    Ollama, OpenRouter và DeepSeek.
                                </li>
                            </ul>
                            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                <span className="border border-border bg-chart-2/10 px-3 py-1">
                                    Điều khiển chat
                                </span>
                                <span className="border border-border bg-chart-3/10 px-3 py-1">
                                    Lịch sử phiên bản
                                </span>
                                <span className="border border-border bg-chart-4/10 px-3 py-1">
                                    Sẵn sàng xuất
                                </span>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                <section className="mt-16">
                    <FadeIn className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold">
                                Bộ sưu tập sơ đồ
                            </h2>
                            <p className="mt-3 text-base text-muted-foreground">
                                Mẫu đầu ra từ prompt thực tế.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center border border-border bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-secondary/80"
                        >
                            Thử prompt của bạn
                        </Link>
                    </FadeIn>
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <FadeIn delay={0.2}>
                            <div className="border border-border border-t-4 border-t-chart-1 bg-card p-4">
                                <Image
                                    src="/animated_connectors.svg"
                                    alt="Kiến trúc transformer với connector động"
                                    width={520}
                                    height={360}
                                    className="h-auto w-full"
                                />
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Connector động giúp trình bày rõ luồng dữ
                                    liệu.
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <div className="border border-border border-t-4 border-t-chart-2 bg-card p-4">
                                <Image
                                    src="/gcp_demo.svg"
                                    alt="Sơ đồ kiến trúc GCP"
                                    width={520}
                                    height={360}
                                    className="h-auto w-full"
                                />
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Hạ tầng GCP với nhóm dịch vụ gọn gàng.
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.4}>
                            <div className="border border-border border-t-4 border-t-chart-3 bg-card p-4">
                                <Image
                                    src="/azure_demo.svg"
                                    alt="Sơ đồ kiến trúc Azure"
                                    width={520}
                                    height={360}
                                    className="h-auto w-full"
                                />
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Bố cục Azure rõ ràng cho review nhanh.
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.5}>
                            <div className="border border-border border-t-4 border-t-chart-4 bg-card p-4">
                                <Image
                                    src="/cat_demo.svg"
                                    alt="Bản phác thảo con mèo"
                                    width={320}
                                    height={320}
                                    className="h-auto w-full"
                                />
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Vẽ phác thảo, flowchart và nhiều loại sơ đồ
                                    khác.
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                <PricingSection
                    title="Bảng giá đơn giản"
                    description="Chọn gói phù hợp với nhu cầu của bạn."
                    tiers={[
                        {
                            name: "Miễn phí",
                            price: "0đ",
                            description: "Dành cho người dùng cá nhân.",
                            features: [
                                "Sử dụng mô hình 0x",
                                "10 sơ đồ/tháng",
                                "Hàng đợi lâu hơn",
                            ],
                            buttonText: "Bắt đầu ngay",
                            href: "/",
                        },
                        {
                            name: "Cơ bản",
                            price: "$3",
                            description: "Dành cho nhu cầu ít.",
                            features: ["100 credits"],
                            buttonText: "Mua credits",
                            href: "/",
                        },
                        {
                            name: "Chuyên nghiệp",
                            price: "$10",
                            description: "Dành cho người dùng thường xuyên.",
                            features: ["500 credits"],
                            buttonText: "Mua credits",
                            href: "/",
                            highlighted: true,
                        },
                    ]}
                />

                <FadeIn className="mt-16 border border-border bg-secondary/60 p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold">
                                Mức sử dụng và minh bạch
                            </h2>
                            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                                Bản demo có giới hạn để đảm bảo ổn định. Dùng
                                khóa API riêng để tăng thông lượng.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
                        >
                            Cấu hình trong cài đặt
                        </Link>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="border border-border bg-chart-1/10 p-5 text-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                Sử dụng token
                            </p>
                            <p className="mt-3 text-2xl font-semibold">
                                {formatNumber(tpmLimit)}
                                <span className="text-sm font-normal text-muted-foreground">
                                    /phút
                                </span>
                            </p>
                            <p className="text-lg font-semibold">
                                {formatNumber(dailyTokenLimit)}
                                <span className="text-sm font-normal text-muted-foreground">
                                    /ngày
                                </span>
                            </p>
                        </div>
                        <div className="border border-border bg-chart-2/10 p-5 text-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                Yêu cầu mỗi ngày
                            </p>
                            <p className="mt-3 text-3xl font-semibold">
                                {dailyRequestLimit}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                lượt yêu cầu
                            </p>
                        </div>
                        <div className="border border-border bg-chart-3/10 p-5 text-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                Dùng khóa riêng
                            </p>
                            <p className="mt-3 text-sm text-muted-foreground">
                                Cấu hình nhà cung cấp và khóa API trong phần cài
                                đặt chat. Khóa chỉ lưu trong trình duyệt.
                            </p>
                        </div>
                    </div>
                </FadeIn>

                {/* <FadeIn className="mt-16 border border-border bg-card p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold">
                                Mã nguồn mở, cộng đồng hậu thuẫn
                            </h2>
                            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                                Fork dự án, chạy riêng tư hoặc ủng hộ bản demo.
                                Mỗi nhà tài trợ giúp dịch vụ vận hành ổn định.
                            </p>
                            <p className="mt-3 text-sm text-muted-foreground">
                                Nếu cần hỗ trợ, hãy mở issue trên GitHub hoặc
                                liên hệ: me[at]jiang.jp
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <iframe
                                src="https://github.com/sponsors/DayuanJiang/button"
                                title="Sponsor DayuanJiang"
                                height="32"
                                width="114"
                                style={{ border: 0 }}
                            />
                            <a
                                href="https://github.com/DayuanJiang/next-ai-draw-io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center border border-border bg-secondary px-4 py-2 text-sm font-semibold text-foreground"
                            >
                                Xem repository
                            </a>
                        </div>
                    </div>
                </FadeIn> */}

                <FadeIn className="mt-16 border border-border bg-gradient-to-r from-primary via-chart-3 to-destructive p-8 text-primary-foreground">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold">
                                Sẵn sàng phác thảo trong vài giây?
                            </h2>
                            <p className="mt-3 max-w-2xl text-base text-primary-foreground/80">
                                Bắt đầu với prompt, tinh chỉnh bằng chat và tạo
                                sơ đồ mà đội ngũ có thể triển khai ngay.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center border border-background bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
                        >
                            Mở trình chỉnh sửa
                        </Link>
                    </div>
                </FadeIn>
            </main>

            <footer className="border-t border-border bg-background">
                <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
                    Clarify - Hiện thực hóa ý tưởng của bạn
                </div>
            </footer>
        </div>
    )
}
