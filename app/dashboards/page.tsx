"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { ApiKeyInsert } from "@/lib/database.types";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  description?: string;
  permissions?: string[];
  expiresAt?: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
  usage?: number;
};

type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

const DashboardsPage = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
    permissions: [] as string[],
    expiresAt: "",
    monthlyUsageLimit: 1000,
    limitEnabled: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});
  const [deleteTarget, setDeleteTarget] = useState<ApiKey | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const getDummyApiKeys = (): ApiKey[] => {
    const now = new Date();
    const oneMonthLater = new Date(now);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    const threeMonthsLater = new Date(now);
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    const sixMonthsLater = new Date(now);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

    return [
      {
        id: "1",
        name: "default",
        key: "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",
        description: "Main API key for production environment",
        permissions: ["read", "write", "admin"],
        expiresAt: sixMonthsLater.toISOString().split("T")[0],
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        usage: 24,
      },
      {
        id: "2",
        name: "tmp1",
        key: "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",
        description: "API key for development and testing purposes",
        permissions: ["read", "write"],
        expiresAt: threeMonthsLater.toISOString().split("T")[0],
        createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        usage: 0,
      },
      {
        id: "3",
        name: "my-cool-api-key",
        key: "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",
        description: "Limited access key with read-only permissions",
        permissions: ["read"],
        expiresAt: oneMonthLater.toISOString().split("T")[0],
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        usage: 0,
      },
      {
        id: "4",
        name: "hello",
        key: "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",
        description: "API key for staging environment testing",
        permissions: ["read", "write", "delete"],
        expiresAt: threeMonthsLater.toISOString().split("T")[0],
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: false,
        usage: 0,
      },
      {
        id: "5",
        name: "cursor",
        key: "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",
        description: "API key for external third-party service integration",
        permissions: ["read", "write"],
        expiresAt: sixMonthsLater.toISOString().split("T")[0],
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        usage: 0,
      },
    ];
  };

  const fetchApiKeys = async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true;
    try {
      if (!silent) setIsLoading(true);
      
      // Check if Supabase is configured
      if (!supabase) {
        console.warn("Supabase not configured, using localStorage");
        const storedKeys = localStorage.getItem("apiKeys");
        if (storedKeys) {
          const parsed = JSON.parse(storedKeys);
          setApiKeys(parsed);
        } else {
          const dummyKeys = getDummyApiKeys();
          localStorage.setItem("apiKeys", JSON.stringify(dummyKeys));
          setApiKeys(dummyKeys);
        }
        if (!silent) setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching API keys:", error);
        showToast("Failed to load API keys", "error");
        // Fallback to localStorage if Supabase fails
        const storedKeys = localStorage.getItem("apiKeys");
        if (storedKeys) {
          const parsed = JSON.parse(storedKeys);
          setApiKeys(parsed);
        }
        return;
      }

      if (data && data.length > 0) {
        // Transform Supabase data to match our ApiKey type
        const transformedKeys: ApiKey[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          key: item.key,
          description: item.description || undefined,
          permissions: item.permissions || [],
          expiresAt: item.expires_at || undefined,
          createdAt: item.created_at || item.created_at_iso,
          lastUsed: item.last_used || undefined,
          isActive: item.is_active ?? true,
          usage: item.usage || 0,
        }));
        setApiKeys(transformedKeys);
      } else {
        // If no data exists, seed with dummy data
        const dummyKeys = getDummyApiKeys();
        await seedDummyData(dummyKeys);
        setApiKeys(dummyKeys);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      showToast("An unexpected error occurred", "error");
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const seedDummyData = async (keys: ApiKey[]) => {
    if (!supabase) return;
    
    try {
      const dataToInsert: ApiKeyInsert[] = keys.map((key) => ({
        name: key.name,
        key: key.key,
        description: key.description ?? null,
        permissions: key.permissions ?? null,
        expires_at: key.expiresAt || null,
        created_at: key.createdAt,
        last_used: key.lastUsed || null,
        is_active: key.isActive,
        usage: key.usage || 0,
        monthly_usage_limit: null,
      }));

      const { error } = await supabase.from("api_keys").insert(dataToInsert as never);

      if (error) {
        console.error("Error seeding dummy data:", error);
      }
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  useEffect(() => {
    if (isModalOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        isModalOpen
      ) {
        handleCloseModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  const saveToDatabase = async (keys: ApiKey[]) => {
    setApiKeys(keys);
  };

  /** PostgreSQL DATE column expects YYYY-MM-DD, not full ISO datetime */
  const normalizeExpiresAtForDb = (value: string | undefined): string | null => {
    const raw = value?.trim();
    if (!raw) return null;
    if (raw.includes("T")) return raw.split("T")[0] ?? null;
    return raw.length >= 10 ? raw.slice(0, 10) : raw;
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const handleCreate = () => {
    setEditingKey(null);
    setFormData({
      name: "",
      key: "",
      description: "",
      permissions: [],
      expiresAt: "",
      monthlyUsageLimit: 1000,
      limitEnabled: false,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (apiKey: ApiKey) => {
    setEditingKey(apiKey);
    setFormData({
      name: apiKey.name,
      key: apiKey.key,
      description: apiKey.description || "",
      permissions: apiKey.permissions || [],
      expiresAt: apiKey.expiresAt || "",
      monthlyUsageLimit: 1000,
      limitEnabled: false,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (apiKey: ApiKey) => {
    setDeleteTarget(apiKey);
  };

  const handleCloseDeleteModal = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    try {
      if (supabase) {
        const { error } = await supabase.from("api_keys").delete().eq("id", id);

        if (error) {
          console.error("Error deleting API key:", error);
          showToast("Failed to delete API key", "error");
          setDeleteTarget(null);
          return;
        }
      } else {
        const updatedKeys = apiKeys.filter((key) => key.id !== id);
        localStorage.setItem("apiKeys", JSON.stringify(updatedKeys));
      }

      const updatedKeys = apiKeys.filter((key) => key.id !== id);
      await saveToDatabase(updatedKeys);
      showToast("API key deleted successfully", "success");
      setDeleteTarget(null);
    } catch (error) {
      console.error("Unexpected error:", error);
      showToast("An unexpected error occurred", "error");
      setDeleteTarget(null);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const keyToUpdate = apiKeys.find((k) => k.id === id);
      if (!keyToUpdate) return;

      const newActiveState = !keyToUpdate.isActive;

      if (supabase) {
        const { error } = await supabase
          .from("api_keys")
          .update({ is_active: newActiveState } as never)
          .eq("id", id);

        if (error) {
          console.error("Error updating API key:", error);
          showToast("Failed to update API key", "error");
          return;
        }
      } else {
        // Fallback to localStorage
        const updatedKeys = apiKeys.map((key) =>
          key.id === id ? { ...key, isActive: newActiveState } : key
        );
        localStorage.setItem("apiKeys", JSON.stringify(updatedKeys));
      }

      const updatedKeys = apiKeys.map((key) =>
        key.id === id ? { ...key, isActive: newActiveState } : key
      );
      await saveToDatabase(updatedKeys);
      showToast(
        `API key ${newActiveState ? "activated" : "deactivated"}`,
        "success"
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      showToast("An unexpected error occurred", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Please enter a key name", "error");
      return;
    }

    try {
      if (editingKey) {
        if (!formData.key.trim()) {
          showToast("Please enter an API key", "error");
          return;
        }

        if (supabase) {
          const { error } = await supabase
            .from("api_keys")
            .update({
              name: formData.name,
              key: formData.key,
              description: formData.description || null,
              permissions:
                formData.permissions.length > 0 ? formData.permissions : null,
              expires_at: normalizeExpiresAtForDb(formData.expiresAt),
              monthly_usage_limit: formData.limitEnabled
                ? formData.monthlyUsageLimit
                : null,
            } as never)
            .eq("id", editingKey.id);

          if (error) {
            console.error("Error updating API key:", error);
            showToast("Failed to update API key", "error");
            return;
          }
        } else {
          // Fallback to localStorage
          const updatedKeys = apiKeys.map((key) =>
            key.id === editingKey.id
              ? {
                  ...key,
                  name: formData.name,
                  key: formData.key,
                  description: formData.description,
                  permissions: formData.permissions,
                  expiresAt: formData.expiresAt,
                }
              : key
          );
          localStorage.setItem("apiKeys", JSON.stringify(updatedKeys));
        }

        const updatedKeys = apiKeys.map((key) =>
          key.id === editingKey.id
            ? {
                ...key,
                name: formData.name,
                key: formData.key,
                description: formData.description,
                permissions: formData.permissions,
                expiresAt: formData.expiresAt,
              }
            : key
        );
        await saveToDatabase(updatedKeys);
        showToast("API key updated successfully", "success");
      } else {
        // Auto-generate key if not provided
        const generatedKey =
          formData.key.trim() ||
          "manish-" +
            Array.from(crypto.getRandomValues(new Uint8Array(32)))
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("");

        if (supabase) {
          const insertPayload: ApiKeyInsert = {
            name: formData.name.trim(),
            key: generatedKey,
            description: formData.description?.trim() || null,
            permissions:
              formData.permissions.length > 0 ? formData.permissions : null,
            expires_at: normalizeExpiresAtForDb(formData.expiresAt),
            is_active: true,
            usage: 0,
            monthly_usage_limit: formData.limitEnabled
              ? formData.monthlyUsageLimit
              : null,
          };

          const { error } = await supabase
            .from("api_keys")
            .insert(insertPayload as never);

          if (error) {
            console.error("Error creating API key:", error);
            const detail =
              "message" in error && error.message
                ? String(error.message)
                : "details" in error && error.details
                  ? String(error.details)
                  : "";
            showToast(
              detail
                ? `Failed to create API key: ${detail}`
                : "Failed to create API key",
              "error"
            );
            return;
          }

          await fetchApiKeys({ silent: true });
        } else {
          // Fallback to localStorage
          const newKey: ApiKey = {
            id: Date.now().toString(),
            name: formData.name,
            key: generatedKey,
            description: formData.description,
            permissions: formData.permissions,
            expiresAt: formData.expiresAt,
            createdAt: new Date().toISOString(),
            isActive: true,
            usage: 0,
          };
          const updatedKeys = [...apiKeys, newKey];
          localStorage.setItem("apiKeys", JSON.stringify(updatedKeys));
          await saveToDatabase(updatedKeys);
        }
        showToast("API key created successfully", "success");
      }

      setIsModalOpen(false);
      setFormData({
        name: "",
        key: "",
        description: "",
        permissions: [],
        expiresAt: "",
        monthlyUsageLimit: 1000,
        limitEnabled: false,
      });
      setEditingKey(null);
    } catch (error) {
      console.error("Unexpected error:", error);
      showToast("An unexpected error occurred", "error");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      key: "",
      description: "",
      permissions: [],
      expiresAt: "",
      monthlyUsageLimit: 1000,
      limitEnabled: false,
    });
    setEditingKey(null);
  };

  const handleCopyKey = async (key: string, name: string) => {
    try {
      await navigator.clipboard.writeText(key);
      showToast(`API key "${name}" copied to clipboard`, "success");

      // Update last_used timestamp in database
      if (supabase) {
        const keyToUpdate = apiKeys.find((k) => k.key === key);
        if (keyToUpdate) {
          await supabase
            .from("api_keys")
            .update({ last_used: new Date().toISOString() } as never)
            .eq("id", keyToUpdate.id);
        }
      }
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      showToast("Failed to copy to clipboard", "error");
    }
  };

  const handleTogglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const filteredKeys = apiKeys.filter((key) =>
    key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    key.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateKey = () => {
    const generatedKey =
      "tvly-" +
      Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    setFormData({ ...formData, key: generatedKey });
  };

  const totalUsage = apiKeys.reduce((sum, key) => sum + (key.usage || 0), 0);
  const apiLimit = 1000;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-slide-in ${
                toast.type === "success"
                  ? "bg-green-500"
                  : toast.type === "error"
                  ? "bg-red-500"
                  : "bg-blue-500"
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Pages / Overview</p>
            <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Operational</span>
            </div>
            <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>
            <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Current Plan Card */}
        <div className="mb-8 rounded-2xl shadow-lg overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-8 relative">
          <div className="absolute top-6 right-6">
            <button className="px-4 py-2 bg-white rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Manage Plan</span>
            </button>
          </div>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-purple-800 text-white text-xs font-semibold rounded">
              CURRENT PLAN
            </span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-6">Researcher</h2>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/90 text-sm">API Limit</span>
              <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 mb-2">
              <div
                className="bg-white/40 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(totalUsage / apiLimit) * 100}%` }}
              ></div>
            </div>
            <p className="text-white/90 text-sm">
              {totalUsage}/{apiLimit} Requests
            </p>
          </div>
        </div>

        {/* API Keys Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">API Keys</h2>
            <button
              onClick={handleCreate}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700 font-semibold text-sm"
              tabIndex={0}
              aria-label="Create new API key"
            >
              Create API key
            </button>
          </div>
          <p className="text-gray-600 mb-6 text-sm">
            The key is used to authenticate your requests to the{" "}
            <a href="#" className="text-blue-600 underline hover:text-blue-800">
              Research API
            </a>
            . To learn more, see the{" "}
            <a href="#" className="text-blue-600 underline hover:text-blue-800">
              documentation page
            </a>
            .
          </p>

          {isLoading ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 text-lg">Loading API keys...</p>
              </div>
            </div>
          ) : filteredKeys.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">
                {apiKeys.length === 0
                  ? "No API keys found"
                  : "No API keys match your search"}
              </p>
              {apiKeys.length === 0 && (
                <button
                  onClick={handleCreate}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  tabIndex={0}
                  aria-label="Create your first API key"
                >
                  Create Your First API Key
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* NAME Column */}
                    <div className="col-span-3">
                      <div className="text-sm font-medium text-gray-900">
                        {apiKey.name}
                      </div>
                    </div>

                    {/* USAGE Column */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-700">{apiKey.usage || 0}</div>
                    </div>

                    {/* KEY Column */}
                    <div className="col-span-4">
                      <code className="bg-gray-100 px-3 py-1.5 rounded text-sm font-mono text-gray-800">
                        {showKey[apiKey.id]
                          ? apiKey.key
                          : `${apiKey.key.substring(0, 4)}-${"*".repeat(30)}`}
                      </code>
                    </div>

                    {/* OPTIONS Column */}
                    <div className="col-span-3 flex items-center gap-3 justify-end">
                      <button
                        onClick={() =>
                          setShowKey({
                            ...showKey,
                            [apiKey.id]: !showKey[apiKey.id],
                          })
                        }
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        tabIndex={0}
                        aria-label={`${showKey[apiKey.id] ? "Hide" : "Show"} API key`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleCopyKey(apiKey.key, apiKey.name)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        tabIndex={0}
                        aria-label={`Copy API key ${apiKey.name}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEdit(apiKey)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        tabIndex={0}
                        aria-label={`Edit API key ${apiKey.name}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(apiKey)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        tabIndex={0}
                        aria-label={`Delete API key ${apiKey.name}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {deleteTarget && (
          <div className="fixed inset-0 bg-red-950/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div
              className="bg-red-600 dark:bg-red-700 rounded-xl shadow-2xl max-w-md w-full p-6 border-4 border-red-500 dark:border-red-600 ring-4 ring-red-400/50 dark:ring-red-500/50"
              role="alertdialog"
              aria-labelledby="delete-modal-title"
              aria-describedby="delete-modal-description"
            >
              <h2
                id="delete-modal-title"
                className="text-2xl font-bold text-white mb-2"
              >
                Delete API Key
              </h2>
              <p
                id="delete-modal-description"
                className="text-red-100 dark:text-red-200 mb-6"
              >
                Are you sure you want to delete &quot;{deleteTarget.name}&quot;? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  className="px-4 py-2 bg-white text-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
                  tabIndex={0}
                  aria-label="Cancel delete"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-6 py-2 bg-red-800 dark:bg-red-900 text-white rounded-lg hover:bg-red-900 dark:hover:bg-red-950 transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
                  tabIndex={0}
                  aria-label="Confirm delete API key"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div
              ref={modalRef}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {editingKey ? "Edit API Key" : "Create a new API key"}
              </h2>
              {!editingKey && (
                <p className="text-gray-600 text-sm mb-6">
                  Enter a name and limit for the new API key.
                </p>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    <span className="font-semibold">Key Name</span> — A unique name to identify this key
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Key Name"
                    required
                    tabIndex={0}
                    aria-label="API key name"
                  />
                </div>

                {!editingKey && (
                  <>
                    <div className="mb-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="limitEnabled"
                          checked={formData.limitEnabled}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              limitEnabled: e.target.checked,
                            })
                          }
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          tabIndex={0}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor="limitEnabled"
                            className="block text-sm font-medium text-gray-900 mb-2 cursor-pointer"
                          >
                            Limit monthly usage*
                          </label>
                          <input
                            type="number"
                            id="monthlyUsageLimit"
                            value={formData.monthlyUsageLimit}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                monthlyUsageLimit: parseInt(e.target.value) || 0,
                              })
                            }
                            disabled={!formData.limitEnabled}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="1000"
                            tabIndex={0}
                            aria-label="Monthly usage limit"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 ml-8">
                        * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                      </p>
                    </div>
                  </>
                )}

                {editingKey && (
                  <>
                    <div className="mb-4">
                      <label
                        htmlFor="key"
                        className="block text-sm font-medium text-gray-900 mb-2"
                      >
                        API Key <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="key"
                          value={formData.key}
                          onChange={(e) =>
                            setFormData({ ...formData, key: e.target.value })
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                          placeholder="Enter or generate API key"
                          required
                          tabIndex={0}
                          aria-label="API key value"
                        />
                        <button
                          type="button"
                          onClick={handleGenerateKey}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                          tabIndex={0}
                          aria-label="Generate random API key"
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 justify-end mt-8">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg font-medium"
                    tabIndex={0}
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    tabIndex={0}
                    aria-label={editingKey ? "Update API key" : "Create API key"}
                  >
                    {editingKey ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardsPage;
