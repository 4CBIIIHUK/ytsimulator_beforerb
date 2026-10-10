"use client";

import React from "react";
import { useGame } from "@/lib/game-engine/GameContext";
import { Card, PageHeader, Button, Progress } from "@/components/ui";
import { IconOffer, IconContract, IconHandshake, IconCross, IconClock } from "@/components/svg/icons";
import { money, mult } from "@/lib/format";

export default function OffersPage() {
  const { state, mods, now, acceptAdOffer, declineAdOffer } = useGame();
  const bs = state.channel?.brandScore ?? 0;
  const nextIn = Math.max(0, Math.ceil((state.nextAdOfferAt - now) / 1000));

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <PageHeader
        icon={<IconOffer size={13} />}
        kicker="Спонсорство"
        title="Рекламные предложения"
        desc="Бренды приходят сами: чем больше подписчиков и выше Brand Score, тем чаще и дороже предложения. Офферы сгорают по таймеру."
        right={
          <div className="grid grid-cols-2 gap-2 text-right">
            <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
              <div className="text-[10px] text-slate-500">Частота</div>
              <div className="font-black text-white">{mult(1 + bs / 300)}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
              <div className="text-[10px] text-slate-500">Выплаты</div>
              <div className="font-black text-emerald-300">{mult(mods.sponsor * (1 + bs / 200))}</div>
            </div>
          </div>
        }
      />

      {!state.channel ? (
        <Card className="p-8 text-center text-sm text-slate-500">Создайте канал, чтобы получать предложения от брендов.</Card>
      ) : state.adOffers.length === 0 ? (
        <Card className="p-8 text-center">
          <IconClock size={28} className="mx-auto text-slate-500" />
          <div className="mt-2 font-bold text-white">Ждём предложений</div>
          <div className="text-sm text-slate-500">Следующий бренд напишет примерно через {nextIn} сек</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {state.adOffers.map((o) => {
            const left = Math.max(0, Math.ceil((o.expiresAt - now) / 1000));
            const total = Math.max(1, (o.expiresAt - (o.expiresAt - 150000)) / 1000);
            return (
              <Card key={o.id} className="flex flex-col p-4" glow="amber">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                      <IconContract size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-white">{o.brand}</div>
                      <div className="text-xs text-slate-500">{o.productDesc}</div>
                    </div>
                  </div>
                  <div className="text-lg font-black text-emerald-300">{money(o.payout)}</div>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                    <span>Действует</span>
                    <span className="font-mono">{left > 600 ? "долго" : `${left} сек`}</span>
                  </div>
                  <Progress value={Math.min(100, (left / total) * 100)} color="from-amber-500 to-yellow-300" />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="warning" className="flex-1" onClick={() => acceptAdOffer(o.id)}>
                    <IconHandshake size={15} /> Подписать
                  </Button>
                  <Button variant="ghost" onClick={() => declineAdOffer(o.id)}>
                    <IconCross size={15} />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
