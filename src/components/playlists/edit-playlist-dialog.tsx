"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Playlist } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DeletePlaylistDialog } from "./delete-playlist-dialog";
import { updatePlaylist, deletePlaylist } from "@/app/actions/playlist-actions";

interface EditPlaylistDialogProps {
  playlist: Playlist;
  isOpen: boolean;
  onClose: () => void;
}

export function EditPlaylistDialog({ playlist, isOpen, onClose }: EditPlaylistDialogProps) {
  const router = useRouter();
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(playlist.image);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCoverPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
        setCoverFile(file);
      } else {
        toast.error('Please select a valid image file');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter a playlist name");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (coverFile) {
        formData.append('cover', coverFile);
      }

      const result = await updatePlaylist(playlist.id, formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Playlist updated successfully!");
      router.refresh();
      onClose();
      
      // Force a hard refresh after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Error updating playlist:", error);
      toast.error("Failed to update playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deletePlaylist(playlist.id);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Playlist deleted successfully!");
      router.push('/');
      onClose();
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error("Failed to delete playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
            <DialogDescription>
              Make changes to your playlist here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cover">Cover Image</Label>
                <div className="mt-2 flex items-center gap-x-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPreview || '/images/playlist-default.png'}
                    alt="Playlist cover"
                    className="w-[100px] h-[100px] rounded-md object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/playlist-default.png';
                    }}
                  />
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="max-w-[200px]"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLoading}
              >
                Delete Playlist
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeletePlaylistDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        playlistName={playlist.name}
      />
    </>
  );
}
