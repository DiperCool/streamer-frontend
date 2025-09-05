"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Plus, Edit, Trash2, Search } from "lucide-react"
import {
  useGetCategoriesQuery,
  useRemoveCategoryMutation,
  SortEnumType,
} from "@/graphql/__generated__/graphql"
import { useDebounce } from "@/hooks/use-debounce"
import { CreateCategoryDialog } from "@/src/components/admin/categories/create-category-dialog"
import { EditCategoryDialog } from "@/src/components/admin/categories/edit-category-dialog"
import { toast } from "sonner"
import Image from "next/image"
import { getMinioUrl } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
    fetchMore,
    networkStatus,
    refetch: refetchCategories,
  } = useGetCategoriesQuery({
    variables: {
      first: 10, // Fetch 10 categories at a time
      search: debouncedSearchTerm,
      order: [{ title: SortEnumType.Asc }], // Default sort by title ascending
    },
    notifyOnNetworkStatusChange: true,
  });

  const [removeCategoryMutation, { loading: removeLoading }] = useRemoveCategoryMutation();

  const handleRemoveCategory = async (categoryId: string) => {
    try {
      await removeCategoryMutation({
        variables: {
          input: {
            id: categoryId,
          },
        },
      });
      refetchCategories();
      toast.success("Category removed successfully!");
    } catch (error: any) {
      console.error("Error removing category:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to remove category. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleLoadMore = async () => {
    if (!categoriesData?.categories?.pageInfo.hasNextPage || networkStatus === 3) return;

    try {
      await fetchMore({
        variables: {
          after: categoriesData.categories.pageInfo.endCursor,
          first: 10,
          search: debouncedSearchTerm,
          order: [{ title: SortEnumType.Asc }],
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.categories?.nodes) {
            return prev;
          }
          return {
            ...prev,
            categories: {
              ...fetchMoreResult.categories,
              nodes: [...(prev.categories?.nodes ?? []), ...(fetchMoreResult.categories.nodes)],
            },
          };
        },
      });
    } catch (error) {
      console.error("Error loading more categories:", error);
      toast.error("Failed to load more categories.");
    }
  };

  const categories = categoriesData?.categories?.nodes || [];
  const hasNextPage = categoriesData?.categories?.pageInfo.hasNextPage;
  const isLoadingMore = networkStatus === 3;

  if (categoriesLoading && networkStatus === 1) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (categoriesError) {
    return <div className="text-red-500">Error loading categories: {categoriesError.message}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Categories Management</h2>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Create New Category
        </Button>
      </div>

      <CreateCategoryDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        refetchCategories={refetchCategories}
      />

      {editCategoryId && (
        <EditCategoryDialog
          categoryId={editCategoryId}
          isOpen={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setEditCategoryId(null);
          }}
          refetchCategories={refetchCategories}
        />
      )}

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search categories..."
              className="w-full bg-gray-700 border-gray-600 pl-10 text-white placeholder:text-gray-400 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {categories.length === 0 && !categoriesLoading ? (
            <p className="text-gray-400">No categories found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Image</TableHead>
                  <TableHead className="text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-300">Slug</TableHead>
                  <TableHead className="text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} className="border-gray-700 hover:bg-gray-700">
                    <TableCell>
                      <Avatar className="w-12 h-12 rounded-md">
                        <AvatarImage src={getMinioUrl(category.image)} alt={category.title} />
                        <AvatarFallback className="bg-gray-600 text-white text-sm">
                          <ImageIcon className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-white">{category.title}</TableCell>
                    <TableCell className="text-gray-300">{category.slug}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-green-500"
                          onClick={() => {
                            setEditCategoryId(category.id);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-500"
                              disabled={removeLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">
                                Are you sure you want to remove this category?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                This action cannot be undone. The category "
                                <span className="font-semibold text-white">
                                  {category.title}
                                </span>" will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveCategory(category.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={removeLoading}
                              >
                                {removeLoading ? "Removing..." : "Remove"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoadingMore ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}