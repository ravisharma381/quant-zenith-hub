import React, { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Pencil, X, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminPricing = () => {
    const [items, setItems] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", price: "", originalPrice: "" });
    const { toast } = useToast();
    const navigate = useNavigate();

    const load = async () => {
        try {
            const q = query(collection(db, "pricing"), orderBy("createdAt", "asc"));
            const snap = await getDocs(q);
            const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setItems(rows);
            setTotalCount(rows.length);
        } catch (err) {
            console.error("Failed to load pricing", err);
            toast({ title: "Failed to load pricing", variant: "destructive" });
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleOpenChange = (state) => {
        setOpen(state);
        if (!state) {
            setEditing(null);
            setForm({ name: "", price: "", originalPrice: "" });
        }
    };

    const onEdit = (item) => {
        setEditing(item);
        setForm({
            name: item.name || "",
            price: item.price !== undefined ? String(item.price) : "",
            originalPrice: item.originalPrice !== undefined ? String(item.originalPrice) : "",
        });
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            const payload = {
                name: String(form.name).trim(),
                price: form.price === "" ? null : Number(form.price),
                originalPrice: form.originalPrice === "" ? null : Number(form.originalPrice),
            };

            if (!payload.name) {
                toast({ title: "Name is required", variant: "destructive" });
                return;
            }

            if (editing) {
                await updateDoc(doc(db, "pricing", editing.id), {
                    ...payload,
                    updatedAt: serverTimestamp(),
                });
                toast({ title: "✅ Pricing updated" });
            } else {
                await addDoc(collection(db, "pricing"), {
                    ...payload,
                    createdAt: serverTimestamp(),
                });
                toast({ title: "🎉 Pricing created" });
            }

            handleOpenChange(false);
            load();
        } catch (err) {
            console.error(err);
            toast({ title: "Error saving pricing", variant: "destructive" });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this pricing entry?")) return;
        try {
            await deleteDoc(doc(db, "pricing", id));
            toast({ title: "🗑️ Deleted" });
            load();
        } catch (err) {
            console.error(err);
            toast({ title: "Failed to delete", variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
                            Back
                        </Button>
                        <h1 className="text-3xl font-bold">Pricing</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => {
                                setEditing(null);
                                setForm({ name: "", price: "", originalPrice: "" });
                                setOpen(true);
                            }}
                            className="flex items-center gap-2"
                        >
                            <PlusCircle className="w-4 h-4" /> Add Pricing
                        </Button>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                        Total pricing entries: <b>{totalCount}</b>
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <Card key={item.id} className="relative group border hover:shadow-md transition">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex justify-between items-center">
                                    {item.name}
                                    <span className="text-xs text-muted-foreground">
                                        {item.price !== undefined && item.price !== null ? `$${item.price}` : "—"}
                                    </span>
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Original: {item.originalPrice !== undefined && item.originalPrice !== null ? `$${item.originalPrice}` : "—"}
                                </p>
                            </CardHeader>

                            <CardContent>
                                <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition">
                                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Modal Add/Edit */}
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit Pricing" : "Add Pricing"}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                placeholder="e.g. Yearly"
                                value={form.name}
                                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                            />
                        </div>

                        <div>
                            <Label>Price (USD)</Label>
                            <Input
                                placeholder="e.g. 199"
                                value={form.price}
                                onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                                type="number"
                            />
                        </div>

                        <div>
                            <Label>Original Price (USD)</Label>
                            <Input
                                placeholder="e.g. 360"
                                value={form.originalPrice}
                                onChange={(e) => setForm((s) => ({ ...s, originalPrice: e.target.value }))}
                                type="number"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPricing;
