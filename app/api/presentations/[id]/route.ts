import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Presentation } from "@/models/Presentation";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // Validate the ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid presentation ID" },
        { status: 400 }
      );
    }

    const presentation = await Presentation.findById(params.id);

    if (!presentation) {
      return NextResponse.json(
        { error: "Presentation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(presentation);
  } catch (error) {
    console.error("Error fetching presentation:", error);
    return NextResponse.json(
      { error: "Failed to fetch presentation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { slides, title } = await request.json();

    // Validate the ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid presentation ID" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (slides) {
      // Ensure each slide has theme and layout
      updateData.slides = slides.map((slide: any) => ({
        ...slide,
        content: {
          ...slide.content,
          theme: slide.content?.theme || 'Default',
          layout: slide.content?.layout || 'Centered'
        }
      }));
    }
    if (title) {
      updateData.title = title;
    }

    const presentation = await Presentation.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    if (!presentation) {
      return NextResponse.json(
        { error: "Presentation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(presentation);
  } catch (error) {
    console.error("Error updating presentation:", error);
    return NextResponse.json(
      { error: "Failed to update presentation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const presentation = await Presentation.findByIdAndDelete(params.id);

    if (!presentation) {
      return NextResponse.json(
        { error: "Presentation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Presentation deleted successfully" });
  } catch (error) {
    console.error("Error deleting presentation:", error);
    return NextResponse.json(
      { error: "Failed to delete presentation" },
      { status: 500 }
    );
  }
} 