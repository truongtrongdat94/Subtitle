﻿import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json({ message: "This is a placeholder for subtitle generation API" });
}

