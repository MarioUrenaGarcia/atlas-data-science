---
id: derivada-como-pendiente-y-razon-de-cambio
titulo: Derivada como pendiente y razón de cambio
titulo_en: Derivative as slope and rate of change
alias:
  - derivada
  - recta tangente
  - razón de cambio instantánea
  - cociente de diferencias
modulo: 0
submodulo: '0.4'
orden: 4
nivel: basico
prerrequisitos:
  - continuidad
etiquetas:
  - derivada
  - pendiente
  - recta tangente
  - razón de cambio
resumen: >
  La derivada f'(a) es el límite de las pendientes de las rectas secantes cuando el segundo punto se acerca
  al primero; es la pendiente de la recta tangente y la razón de cambio instantánea de f en a.
formula: 'f''(a) = \lim_{h \to 0} \frac{f(a + h) - f(a)}{h}'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: secante
    funcion: x-exp
    x0: 0.5
    h: 3
referencias:
  - clave: blitzstein-hwang
  - clave: goodfellow
    capitulo: '4'
publicado: true
---

## Intuición

La velocidad promedio de un ciclista entre dos instantes es la distancia recorrida dividida entre el tiempo transcurrido. En una gráfica de distancia contra tiempo, ese cociente es la pendiente de la recta que une los dos puntos: una secante. Si el segundo instante se acerca cada vez más al primero, la secante gira hasta coincidir con la recta que apenas toca la curva en ese punto, la tangente, y el cociente se acerca a la velocidad instantánea que marca el velocímetro.

La derivada es ese valor límite. Dice cuánto cambia la salida por cada unidad de cambio en la entrada, justo en un punto: cuántos pesos de costo adicional produce una unidad más fabricada, cuántos grados sube la temperatura por minuto en cierto momento, cuánto cambia el error de un modelo al mover un parámetro. Una derivada positiva indica que la función sube, negativa que baja y cero que está momentáneamente plana.

## Definición

:::definicion[Derivada en un punto]
La **derivada** de $f$ en $a$ es
$$
f'(a) = \lim_{h \to 0} \frac{f(a + h) - f(a)}{h},
$$
si el límite existe; entonces se dice que $f$ es **derivable** en $a$. La **recta tangente** a la gráfica en $(a, f(a))$ es $y = f(a) + f'(a)(x - a)$.
:::

El cociente $\frac{f(a + h) - f(a)}{h}$ es la pendiente de la secante por $(a, f(a))$ y $(a + h, f(a + h))$, o **razón de cambio promedio** en $[a, a + h]$. La función $x \mapsto f'(x)$ se llama **función derivada**, también escrita $\frac{df}{dx}$.

:::nota[Qué significa cada símbolo]
- $f$: función estudiada.
- $a$: punto donde se deriva.
- $h$: incremento en la entrada; puede ser positivo o negativo.
- $f(a + h) - f(a)$: cambio en la salida.
- $f'(a)$: derivada de $f$ en $a$, pendiente de la tangente.
- $\frac{df}{dx}$: notación de Leibniz para la derivada.
- $y = f(a) + f'(a)(x - a)$: ecuación de la recta tangente.
:::

## Cómo usar la visualización

La curva es $f(x) = x\,e^{-x}$ y el punto amarillo está en $x_0 = 0.5$. El punto naranja está en $x_0 + h$ y la recta naranja es la secante entre ambos. La reproducción reduce $h$ paso a paso: la secante gira hacia la tangente punteada. El panel compara la pendiente de la secante con $f'(x_0)$ y muestra su diferencia.

Con $h$ grande la secante cruza la curva lejos del punto y su pendiente es muy distinta. Al achicar $h$, la diferencia con la derivada se reduce más o menos a la mitad cada vez que $h$ se reduce a la mitad. El triángulo punteado muestra el cambio en $x$ y el cambio en $y$ que forman la pendiente.

## Ejemplo

Un objeto recorre $s(t) = t^2$ metros en $t$ segundos. Se busca su velocidad en $t = 2$.

1. Velocidad promedio en $[2, 2 + h]$: $\frac{(2 + h)^2 - 4}{h} = \frac{4h + h^2}{h} = 4 + h$.
2. Con $h = 1$: 5 m/s. Con $h = 0.1$: 4.1 m/s. Con $h = 0.01$: 4.01 m/s.
3. Al tender $h \to 0$ el cociente tiende a 4: $s'(2) = 4$ m/s.
4. La recta tangente en $(2, 4)$ es $y = 4 + 4(t - 2) = 4t - 4$.
5. En general $s'(t) = \lim_{h \to 0} (2t + h) = 2t$.

:::figura[El objeto del ejemplo: la secante desde t = 2 gira hasta la tangente y su pendiente baja de 4.9 a 4 conforme h se reduce.]{componente="CalculusViz"}
```yaml
modo: secante
funcion: cuadrada
x0: 2
h: 0.9
```
:::

## Propiedades

- **Derivable implica continua:** si $f'(a)$ existe, $f$ es continua en $a$.
- **Signo y monotonía:** si $f' > 0$ en un intervalo, $f$ es creciente ahí; si $f' < 0$, decreciente.
- **Aproximación lineal:** $f(a + h) \approx f(a) + f'(a)\,h$ para $h$ pequeño, con error de orden $h^2$ si $f''$ existe.
- **Derivadas laterales:** en una esquina las secantes por la izquierda y por la derecha tienden a pendientes distintas y la derivada no existe.
- **Unidades:** $f'$ tiene unidades de salida entre unidades de entrada, por ejemplo metros por segundo.
- **Diferencias finitas:** $\frac{f(a + h) - f(a - h)}{2h}$ aproxima $f'(a)$ con error de orden $h^2$, mejor que la diferencia hacia adelante.

:::figura[Caso sin derivada: en la esquina de |x| la secante desde la derecha tiene siempre pendiente 1, mientras que desde la izquierda tendría pendiente -1. Los dos lados no coinciden y no hay tangente.]{componente="CalculusViz"}
```yaml
modo: secante
funcion: valor-absoluto
x0: 0
h: 1.5
```
:::

:::demostracion
Derivable implica continua: $f(a + h) - f(a) = \frac{f(a + h) - f(a)}{h}\cdot h$. Cuando $h \to 0$ el primer factor tiende a $f'(a)$ y el segundo a 0, así que $f(a + h) \to f(a)$.
:::

## Errores comunes

- **Confundir la derivada con el valor de la función.** $f(2) = 4$ es una posición; $f'(2) = 4$ es una velocidad. Coinciden en este ejemplo por casualidad.
- **Sustituir $h = 0$ en el cociente.** Da $0/0$; hay que simplificar antes o calcular el límite.
- **Creer que toda función continua es derivable.** Las esquinas y las puntas verticales son continuas y no tienen derivada.
- **Tomar $h$ extremadamente pequeño en cálculo numérico.** Con $h \approx 10^{-16}$ el redondeo domina y la aproximación empeora.

## Conexiones

La derivada es un límite, como en [[limites]], y requiere [[continuidad]]. Se calcula con las [[reglas-de-derivacion]] y la [[regla-de-la-cadena]], se repite en las [[derivadas-de-orden-superior]] y sirve para hallar [[maximos-y-minimos]]. El [[teorema-fundamental-del-calculo]] la conecta con la integral. En aprendizaje automático, el descenso de gradiente mueve los parámetros en contra de la derivada del error.

## Formulario

:::formula[Derivada]
$$
f'(a) = \lim_{h \to 0} \frac{f(a + h) - f(a)}{h}
$$

- $h$: incremento de la entrada.
- $f'(a)$: pendiente de la tangente en $a$.
:::

:::formula[Recta tangente]
$$
y = f(a) + f'(a)\,(x - a)
$$

- $(a, f(a))$: punto de tangencia.
:::

:::formula[Aproximación lineal]
$$
f(a + h) \approx f(a) + f'(a)\,h
$$

- Válida para $h$ pequeño.
:::

:::formula[Diferencia centrada]
$$
f'(a) \approx \frac{f(a + h) - f(a - h)}{2h}
$$

- Error de orden $h^2$ si $f$ tiene tercera derivada continua.
:::
