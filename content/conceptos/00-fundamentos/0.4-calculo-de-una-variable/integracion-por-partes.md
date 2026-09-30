---
id: integracion-por-partes
titulo: Integración por partes
titulo_en: Integration by parts
alias:
  - partes
  - fórmula de integración por partes
modulo: 0
submodulo: '0.4'
orden: 17
nivel: basico
prerrequisitos:
  - teorema-fundamental-del-calculo
  - reglas-de-derivacion
etiquetas:
  - integración
  - regla del producto
  - antiderivadas
  - técnicas de integración
resumen: >
  La integración por partes, int u dv = uv - int v du, traslada la derivada de un factor al otro; es la
  regla del producto leída al revés y geométricamente reparte un rectángulo en dos áreas.
formula: '\int_a^b u\,dv = \big[uv\big]_a^b - \int_a^b v\,du'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: partes
    casos: [logaritmo, x-coseno, x-exponencial]
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

La regla del producto dice que la derivada de $uv$ reparte el cambio entre los dos factores: $(uv)' = u'v + uv'$. Al integrar, el cambio total de $uv$ es la suma de dos acumulaciones: $\int u\,dv + \int v\,du$. Si una de ellas es difícil y la otra fácil, se despeja la difícil.

Hay una imagen geométrica muy clara. Al dibujar la curva formada por los puntos $(u, v)$, el rectángulo de lados $u$ y $v$ queda dividido por la curva en dos regiones: el área bajo la curva es $\int v\,du$ y el área a su izquierda es $\int u\,dv$. Sus dos áreas suman el rectángulo. La técnica sirve cuando el integrando es un producto en el que un factor se simplifica al derivarse (como $x$ o $\log x$) y el otro no se complica al integrarse (como $e^x$ o $\cos x$).

## Definición

:::teorema[Integración por partes]
Si $u$ y $v$ tienen derivadas continuas en $[a, b]$,
$$
\int_a^b u(x)\,v'(x)\,dx = \big[u(x)v(x)\big]_a^b - \int_a^b v(x)\,u'(x)\,dx,
$$
que en forma abreviada es $\int u\,dv = uv - \int v\,du$.
:::

La elección de $u$ y $dv$ es la parte creativa: se busca que $du$ sea más simple que $u$ y que $v = \int dv$ se pueda calcular.

:::nota[Qué significa cada símbolo]
- $u$: factor que se deriva; $du = u'(x)\,dx$.
- $dv = v'(x)\,dx$: factor que se integra; $v$ es una antiderivada.
- $[uv]_a^b$: $u(b)v(b) - u(a)v(a)$, el cambio del producto.
- $\int v\,du$: integral que queda por resolver.
- $a, b$: límites de integración.
:::

## Cómo usar la visualización

La curva negra es $(u(x), v(x))$ mientras $x$ recorre el intervalo. El área azul, a la izquierda de la curva, es $\int u\,dv$; el área naranja, bajo la curva, es $\int v\,du$. El rectángulo punteado tiene área $u\,v$ en el punto final. La reproducción avanza $x$ y ambas áreas crecen; el encabezado verifica la fórmula con números.

En la integral de $\log x$, el área azul vale exactamente 1 y la naranja $e - 1$: juntas forman el rectángulo de área $e$. Con $x\cos x$ la curva se dobla porque $v = \operatorname{sen} x$ llega a su máximo al final del intervalo.

## Ejemplo

La integral $\int_0^1 x\,e^{x}\,dx$ aparece al calcular el valor esperado de un tiempo de espera ponderado.

1. Se elige $u = x$ (se simplifica al derivar) y $dv = e^x dx$ (fácil de integrar): $du = dx$, $v = e^x$.
2. $\int_0^1 x\,e^x dx = \big[x\,e^x\big]_0^1 - \int_0^1 e^x\,dx$.
3. $\big[x\,e^x\big]_0^1 = e - 0 = e$.
4. $\int_0^1 e^x\,dx = e - 1$.
5. Resultado: $e - (e - 1) = 1$.

:::figura[La integral del ejemplo en el plano (u, v) con u = x y v = e^x: el área a la izquierda de la curva es 1 y la de abajo es e - 1, y juntas llenan el rectángulo de área e.]{componente="CalculusViz"}
```yaml
modo: partes
casos: [x-exponencial]
```
:::

## Propiedades

- **Casos típicos:** $\int x^n e^{x}dx$, $\int x^n\cos x\,dx$, $\int \log x\,dx$, $\int x^n \log x\,dx$.
- **Aplicación repetida:** en $\int x^2 e^x dx$ se aplica dos veces hasta que desaparece la potencia.
- **Integrales cíclicas:** en $\int e^x\cos x\,dx$ la integral original reaparece y se despeja: vale $\tfrac{1}{2}e^x(\cos x + \operatorname{sen} x) + C$.
- **Función gamma:** integrar por partes $\int_0^\infty t^{x}e^{-t}dt$ da $\Gamma(x + 1) = x\,\Gamma(x)$.
- **Esperanza y cola:** para $X \ge 0$ con densidad, $\mathbb{E}[X] = \int_0^\infty P(X > t)\,dt$, que se prueba por partes.

:::demostracion
Por la regla del producto, $(uv)' = u'v + uv'$. Integrando de $a$ a $b$ y usando el teorema fundamental, $\big[uv\big]_a^b = \int_a^b u'v\,dx + \int_a^b uv'\,dx$, y se despeja $\int_a^b uv'\,dx$.
:::

## Errores comunes

- **Elegir mal $u$.** Con $u = e^x$ y $dv = x\,dx$ en $\int x e^x dx$ la nueva integral, $\int \frac{x^2}{2}e^x dx$, es más difícil.
- **Olvidar el término de borde.** En la integral definida, $[uv]_a^b$ debe evaluarse.
- **Errores de signo.** La fórmula tiene un signo menos delante de $\int v\,du$.
- **Integrar $dv$ con constante arbitraria y luego olvidarla.** Cualquier antiderivada sirve; basta tomar una sin constante.

## Conexiones

La integración por partes es la [[reglas-de-derivacion|regla del producto]] leída con el [[teorema-fundamental-del-calculo]]. Complementa a la [[integracion-por-sustitucion]] y es la herramienta para deducir la relación recursiva de la [[funcion-gamma]]. En probabilidad aparece al calcular momentos de distribuciones y al relacionar la esperanza con la función de supervivencia.

## Formulario

:::formula[Integración por partes]
$$
\int_a^b u\,dv = \big[uv\big]_a^b - \int_a^b v\,du
$$

- $u$: factor derivado; $dv$: factor integrado.
:::

:::formula[Forma indefinida]
$$
\int u(x)\,v'(x)\,dx = u(x)\,v(x) - \int v(x)\,u'(x)\,dx
$$

- $u', v'$: derivadas continuas.
:::

:::formula[Ejemplos resueltos]
$$
\int x\,e^{x}dx = (x - 1)e^{x} + C, \qquad \int \log x\,dx = x\log x - x + C
$$

- $C$: constante de integración.
:::
