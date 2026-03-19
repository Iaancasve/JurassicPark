<?php

namespace App\Events;

use App\Models\Celda;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CeldaUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $celda;

    public function __construct(Celda $celda)
    {
        $this->celda = $celda;
    }

    public function broadcastOn()
    {
        // Canal público
        return new Channel('parque-mapa');
    }

    public function broadcastAs()
    {
        return 'celda.actualizada';
    }
}